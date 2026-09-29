import express from 'express';
import { jagoKnowledgeBase } from '../data/jagoKnowledge.js';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/jago/chat
router.post('/chat', authenticateToken, (req, res) => {
  try {
    const { query, message } = req.body;
    const userQuery = (query || message || '').trim().toLowerCase();

    if (!userQuery) {
      return res.status(400).json({ success: false, message: 'Question or query is required.' });
    }

    // Pull student context if logged in as student
    let studentContext = null;
    let latestApp = null;
    let docs = [];
    let verifications = [];

    if (req.user.role === 'student' && req.studentProfile) {
      studentContext = req.studentProfile;
      latestApp = db.prepare(`
        SELECT a.*, s.title as scholarship_title, s.category as scholarship_category
        FROM applications a
        JOIN scholarships s ON s.id = a.scholarship_id
        WHERE a.student_id = ?
        ORDER BY a.created_at DESC LIMIT 1
      `).get(studentContext.id);

      docs = db.prepare('SELECT * FROM documents WHERE student_id = ?').all(studentContext.id);

      if (latestApp) {
        verifications = db.prepare('SELECT * FROM verification_records WHERE application_id = ?').all(latestApp.id);
      }
    }

    let responseText = '';
    let suggestions = [];
    let references = [];

    // Contextual Pattern 1: Missing documents / Document status
    if (userQuery.includes('missing') || (userQuery.includes('document') && (userQuery.includes('need') || userQuery.includes('what')))) {
      if (latestApp) {
        const mismatchVeri = verifications.find(v => v.status === 'MISMATCH');
        if (mismatchVeri) {
          responseText = `Your ${latestApp.scholarship_title} application (${latestApp.application_no}) currently requires clarification for the ${mismatchVeri.service_name} / income verification record. You can submit a simple clarification in the VeriCore tab.`;
        } else {
          responseText = `Your application for ${latestApp.scholarship_title} has all primary documents uploaded in DigiVault. Current verified documents include: ${docs.map(d => d.document_type).join(', ')}.`;
        }
      } else {
        responseText = `For standard Post-Matric scholarships, you typically need: ST Certificate, Income Certificate (issued by Revenue Authority), Previous Marksheets, College Bonafide/Admission Receipt, and Aadhaar card linked to your bank account.`;
      }
      suggestions = ['Why is my application pending?', 'Where is my application?', 'How do I correct a mismatch?'];
      references.push('DigiVault Document Repository', 'Ministry of Tribal Affairs Guidelines');
    }

    // Contextual Pattern 2: Pending / Why is my application pending
    else if (userQuery.includes('why') && (userQuery.includes('pending') || userQuery.includes('waiting') || userQuery.includes('status'))) {
      if (latestApp) {
        if (latestApp.status === 'Department Verification') {
          responseText = `Your application (${latestApp.application_no}) is currently at Department Verification stage with the State Tribal Welfare Department. No action is required on your part unless an officer requests clarification.`;
        } else if (latestApp.status === 'Manual Review Required') {
          responseText = `Your application is currently with an authorized welfare officer for manual review due to a minor verification difference. Automated applications are never rejected automatically; the officer is examining your record.`;
        } else {
          responseText = `Your application status is currently: "${latestApp.status}". ${jagoKnowledgeBase.statusExplanations[latestApp.status] || ''}`;
        }
      } else {
        responseText = `I don't have an active application on file for your profile to determine a specific pending reason.`;
      }
      suggestions = ['What documents are missing?', 'When was my application submitted?', 'What is FundTrack?'];
      references.push('VeriCore Status Pipeline');
    }

    // Contextual Pattern 3: Where is my application / Status track
    else if (userQuery.includes('where') || userQuery.includes('track') || userQuery.includes('status')) {
      if (latestApp) {
        responseText = `Your application ${latestApp.application_no} for "${latestApp.scholarship_title}" is currently at the "${latestApp.status}" stage. It was submitted on ${latestApp.submission_date}.`;
      } else {
        responseText = `You currently do not have any active submitted applications. You can explore available scholarships in the Scholarship Hub.`;
      }
      suggestions = ['Why is my application pending?', 'What documents are missing?', 'Am I eligible?'];
    }

    // Contextual Pattern 4: When was my application submitted
    else if (userQuery.includes('when') && userQuery.includes('submit')) {
      if (latestApp) {
        responseText = `Your application (${latestApp.application_no}) was submitted on ${latestApp.submission_date}.`;
      } else {
        responseText = `No submitted application records found for this account.`;
      }
      suggestions = ['Where is my application?', 'Am I eligible?'];
    }

    // Contextual Pattern 5: How do I correct a mismatch
    else if (userQuery.includes('mismatch') || userQuery.includes('correct') || userQuery.includes('clarification')) {
      responseText = `In TRINEX, automated mismatches are never automatically rejected. You can navigate to the "VeriCore" page, locate the flagged integration item (e.g. State e-District / Income), and click "Submit Clarification" to provide supplementary details or an updated document.`;
      suggestions = ['Where is my application?', 'What documents are missing?'];
      references.push('TRINEX VeriCore Workflow Guidelines');
    }

    // Contextual Pattern 6: Am I eligible / Eligibility
    else if (userQuery.includes('eligible') || userQuery.includes('eligibility')) {
      if (studentContext) {
        responseText = `Based on your profile as a Scheduled Tribe student enrolled in ${studentContext.course || 'higher education'} with an annual family income of ₹${Number(studentContext.family_income).toLocaleString()}, you are potentially eligible for the Post-Matric Scholarship for ST Students and may also explore Top Class Scholarships if studying in a premier institution.`;
      } else {
        responseText = `ST students enrolled in recognized schools, colleges, or universities with a valid ST certificate and qualifying family income are eligible for central and state tribal scholarships. You can use our interactive Eligibility Checker tool for a detailed evaluation.`;
      }
      suggestions = ['Check Eligibility', 'What documents do I need?', 'Where is my application?'];
      references.push('MoTA Central Sector & Centrally Sponsored Scheme Guidelines');
    }

    // Contextual Pattern 7: Payment / Disbursement / FundTrack
    else if (userQuery.includes('payment') || userQuery.includes('disbursement') || userQuery.includes('money') || userQuery.includes('fundtrack') || userQuery.includes('sanction')) {
      const payment = latestApp ? db.prepare('SELECT * FROM payments WHERE application_id = ?').get(latestApp.id) : null;
      if (payment) {
        responseText = `Your scholarship has been sanctioned for ₹${Number(payment.sanctioned_amount).toLocaleString()}. Current payment status is "${payment.payment_status}". Direct benefit transfer processing is active under PFMS reference ${payment.transaction_ref || 'DBT-PFMS-9482'}.`;
      } else {
        responseText = `Scholarship payments are processed via Direct Benefit Transfer (DBT) directly into your Aadhaar-seeded bank account once Department Verification and Financial Sanction are complete.`;
      }
      suggestions = ['What is FundTrack?', 'Why is my application pending?'];
      references.push('Public Financial Management System (PFMS) DBT Protocol');
    }

    // Contextual Pattern 8: General Scheme Knowledge Queries
    else {
      // Check if user asked about specific scheme
      const matchedScheme = jagoKnowledgeBase.schemes.find(s =>
        userQuery.includes(s.shortCode.toLowerCase()) ||
        userQuery.includes(s.name.toLowerCase()) ||
        (userQuery.includes('pre-matric') && s.shortCode.includes('9-10')) ||
        (userQuery.includes('top class') && s.shortCode.includes('PREMIER')) ||
        (userQuery.includes('fellowship') && s.shortCode.includes('NFST')) ||
        (userQuery.includes('overseas') && s.shortCode.includes('NOS'))
      );

      if (matchedScheme) {
        responseText = `**${matchedScheme.name}**\n\n${matchedScheme.description}\n\n• **Education Level:** ${matchedScheme.targetLevel}\n• **Income Ceiling:** ${matchedScheme.incomeLimit}\n• **Key Benefits:** ${matchedScheme.benefits}\n• **Key Documents:** ${matchedScheme.documents.join(', ')}`;
        references.push(matchedScheme.source);
        suggestions = ['Am I eligible?', 'What documents are missing?'];
      } else {
        // Fallback with controlled safety
        responseText = `I understand you are asking about "${query || message}". To provide an exact answer, could you specify whether your question is about scheme eligibility, application tracking, DigiVault documents, or DBT payment disbursement?`;
        suggestions = [
          'Am I eligible?',
          'What documents are missing?',
          'Why is my application pending?',
          'Where is my application?',
          'How do I correct a mismatch?'
        ];
      }
    }

    return res.json({
      success: true,
      answer: responseText,
      suggestions,
      references: references.length > 0 ? references : ['TRINEX Scholarship Knowledge Base v2026.1'],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[JAGO Chat Error]', err);
    return res.status(500).json({
      success: false,
      message: 'I encountered an error processing your query. Please try asking again.',
      answer: "I don't have enough information to determine that right now."
    });
  }
});

export default router;

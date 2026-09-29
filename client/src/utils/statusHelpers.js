export const getStatusConfig = (status) => {
  switch (status) {
    case 'Submitted':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'Submitted'
      };
    case 'Document Verification':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Document Verification'
      };
    case 'Institution Verification':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        label: 'Institution Verification'
      };
    case 'Department Verification':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
        label: 'Department Verification'
      };
    case 'Manual Review Required':
    case 'Clarification Required':
    case 'Action Required':
    case 'MISMATCH':
    case 'PENDING_REVIEW':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: status === 'MISMATCH' ? 'Mismatch Detected' : status
      };
    case 'Sanctioned':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Sanctioned'
      };
    case 'Disbursement':
    case 'Transferred':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        dot: 'bg-teal-500',
        label: 'Disbursement Active'
      };
    case 'Completed':
    case 'MATCHED':
    case 'Verified':
    case 'VERIFIED_MANUAL':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        dot: 'bg-green-500',
        label: status === 'MATCHED' ? 'Record Matched' : (status === 'VERIFIED_MANUAL' ? 'Verified by Officer' : status)
      };
    case 'Expired':
    case 'Rejected':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        label: status
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Pending'
      };
  }
};

export const standardTimelineSteps = [
  { key: 'Submitted', label: 'Submitted', description: 'Application received online' },
  { key: 'Document Verification', label: 'Document Verification', description: 'DigiVault digital records check' },
  { key: 'Institution Verification', label: 'Institution Verification', description: 'Nodal officer bonafide check' },
  { key: 'Department Verification', label: 'Department Verification', description: 'State Tribal Welfare scrutiny' },
  { key: 'Sanction', label: 'Sanction', description: 'Financial approval order issued' },
  { key: 'Disbursement', label: 'Disbursement', description: 'Direct DBT bank credit' }
];

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

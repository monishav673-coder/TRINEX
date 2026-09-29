import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { JagoChat } from './components/JagoChat';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { Scholarships } from './pages/Scholarships';
import { Eligibility } from './pages/Eligibility';
import { Application } from './pages/Application';
import { ApplicationDetails } from './pages/ApplicationDetails';
import { DigiVault } from './pages/DigiVault';
import { VeriCore } from './pages/VeriCore';
import { FundTrack } from './pages/FundTrack';
import { Notifications } from './pages/Notifications';
import { Jago } from './pages/Jago';
import { Profile } from './pages/Profile';
import { HelpSupport } from './pages/HelpSupport';

// Officer Pages
import { OfficerDashboard } from './pages/OfficerDashboard';
import { OfficerApplications } from './pages/OfficerApplications';
import { ManualReview } from './pages/ManualReview';
import { BeneficiaryInsight } from './pages/BeneficiaryInsight';
import { Reports } from './pages/Reports';

export const App = () => {
  const { user, isAuthenticated, isOfficer, isStudent } = useAuth();
  const location = useLocation();

  const isPublicOnlyPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar for Authenticated Views */}
        {isAuthenticated && !isPublicOnlyPage && <Sidebar />}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/help" element={<HelpSupport />} />

            {/* Student Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply"
              element={
                <ProtectedRoute requiredRole="student">
                  <Application />
                </ProtectedRoute>
              }
            />
            <Route
              path="/digivault"
              element={
                <ProtectedRoute requiredRole="student">
                  <DigiVault />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vericore"
              element={
                <ProtectedRoute requiredRole="student">
                  <VeriCore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fundtrack"
              element={
                <ProtectedRoute requiredRole="student">
                  <FundTrack />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jago"
              element={
                <ProtectedRoute requiredRole="student">
                  <Jago />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Officer Protected Routes */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute requiredRole="officer">
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/applications"
              element={
                <ProtectedRoute requiredRole="officer">
                  <OfficerApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/manual-review"
              element={
                <ProtectedRoute requiredRole="officer">
                  <ManualReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/beneficiary-insight"
              element={
                <ProtectedRoute requiredRole="officer">
                  <BeneficiaryInsight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/payments"
              element={
                <ProtectedRoute requiredRole="officer">
                  <FundTrack />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/reports"
              element={
                <ProtectedRoute requiredRole="officer">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/audit-logs"
              element={
                <ProtectedRoute requiredRole="officer">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/profile"
              element={
                <ProtectedRoute requiredRole="officer">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Mandatory Footer */}
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && !isPublicOnlyPage && <BottomNav />}

      {/* Floating JAGO AI Assistant Widget */}
      {isAuthenticated && isStudent && <JagoChat />}
    </div>
  );
};

export default App;

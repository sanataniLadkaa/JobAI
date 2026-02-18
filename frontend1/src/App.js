import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import CandidateSearch from './components/CandidateSearch';
import CandidateJobs from './components/CandidateJobs';
import ManageJobs from './components/ManageJobs';
import ViewApplications from './components/ViewApplications';
import MyApplications from './components/MyApplications';
import EditProfile from './components/EditProfile';
import ShortlistedCandidates from './components/ShortlistedCandidates';
import ScheduledInterviews from './components/ScheduledInterviews';
import SalaryEstimator from './components/SalaryEstimator';
import Signup from './components/Signup'; // <--- IMPORT
import ManageSlots from './components/ManageSlots';
import BookSlot from './components/BookSlot';
import MyInterviews from './components/MyInterviews'; // <--- IMPORT

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get loading state
  
  // Show loading while checking auth
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading user data...</div>;
  
  // Redirect to login if no user found
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// Smart Redirect based on Role
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth(); // Get loading state
  
  // Show loading while checking auth
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  
  // Safety net: if loading is done but user is null
  if (!user) return <Navigate to="/login" />;
  
  // Redirect based on role
  if (user.role === 'recruiter') return <Navigate to="/recruiter-dashboard" />;
  if (user.role === 'candidate') return <Navigate to="/candidate-dashboard" />;
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Smart Dashboard Route */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter-dashboard" element={
            <PrivateRoute><RecruiterDashboard /></PrivateRoute>
          } />
          <Route path="/search" element={
            <PrivateRoute><CandidateSearch /></PrivateRoute>
          } />
          <Route path="/manage-jobs" element={
            <PrivateRoute><ManageJobs /></PrivateRoute>
          } />
          <Route path="/view-applications" element={
  <PrivateRoute><ViewApplications /></PrivateRoute>
} />
          {/* Candidate Routes */}
          <Route path="/candidate-dashboard" element={
            <PrivateRoute><CandidateDashboard /></PrivateRoute>
          } />
          <Route path="/candidate-jobs" element={
            <PrivateRoute><CandidateJobs /></PrivateRoute>
          } />
          <Route path="/my-applications" element={
  <PrivateRoute><MyApplications /></PrivateRoute>
} />

          <Route path="/edit-profile" element={
            <PrivateRoute><EditProfile /></PrivateRoute>
          } />

          <Route path="/shortlisted" element={
            <PrivateRoute><ShortlistedCandidates /></PrivateRoute>
          } /> {/* <--- ADD ROUTE */}


          <Route path="/scheduled-interviews" element={
            <PrivateRoute><ScheduledInterviews /></PrivateRoute>
          } /> {/* <--- ADD ROUTE */}

          <Route path="/salary-estimator" element={
            <PrivateRoute><SalaryEstimator /></PrivateRoute>
          } />
          {/* Default / Root Route */}
          <Route path="/" element={<RoleBasedRedirect />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/manage-slots" element={<PrivateRoute><ManageSlots /></PrivateRoute>} />
          <Route path="/book-slot" element={<PrivateRoute><BookSlot /></PrivateRoute>} />
          <Route path="/my-interviews" element={<PrivateRoute><MyInterviews /></PrivateRoute>} /> {/* <--- ADD ROUTE */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
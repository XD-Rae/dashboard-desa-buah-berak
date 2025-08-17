import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import FacultyList from '../pages/faculty/FacultyList';
import FacultyDetail from '../pages/faculty/FacultyDetail';
import FacultyForm from '../pages/faculty/FacultyForm';
import AchievementList from '../pages/achievements/AchievementList';
import AchievementDetail from '../pages/achievements/AchievementDetail';
import AchievementForm from '../pages/achievements/AchievementForm';
import EventList from '../pages/events/EventList';
import EventDetail from '../pages/events/EventDetail';
import EventForm from '../pages/events/EventForm';
import PartnerList from '../pages/partners/PartnerList';
import PartnerForm from '../pages/partners/PartnerForm';
import TestimonialList from '../pages/testimonials/TestimonialList';
import TestimonialForm from '../pages/testimonials/TestimonialForm';
import HKIList from '../pages/intellectual-property/HKIList';
import HKIForm from '../pages/intellectual-property/HKIForm';
import PatentList from '../pages/intellectual-property/PatentList';
import PatentForm from '../pages/intellectual-property/PatentForm';
import IndustrialDesignList from '../pages/intellectual-property/IndustrialDesignList';
import IndustrialDesignForm from '../pages/intellectual-property/IndustrialDesignForm';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  // If user is logged in, redirect from login page to appropriate page
  if (user && window.location.pathname === '/login') {
    return <Navigate to={user.role === 'admin' ? '/' : '/faculty/new'} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        
        <Route path="faculty">
          <Route index element={<FacultyList />} />
          <Route path="new" element={<FacultyForm />} />
          <Route path=":id" element={<FacultyDetail />} />
          <Route path="edit/:id" element={<FacultyForm />} />
        </Route>
        
        <Route path="achievements">
          <Route index element={<AchievementList />} />
          <Route path="new" element={<AchievementForm />} />
          <Route path=":id" element={<AchievementDetail />} />
          <Route path="edit/:id" element={<AchievementForm />} />
        </Route>
        
        <Route path="events">
          <Route index element={<EventList />} />
          <Route path="new" element={<EventForm />} />
          <Route path=":id" element={<EventDetail />} />
          <Route path="edit/:id" element={<EventForm />} />
        </Route>
        
        <Route path="partners">
          <Route index element={<PartnerList />} />
          <Route path="new" element={<PartnerForm />} />
          <Route path="edit/:id" element={<PartnerForm />} />
        </Route>
        
        <Route path="testimonials">
          <Route index element={<TestimonialList />} />
          <Route path="new" element={<TestimonialForm />} />
          <Route path="edit/:id" element={<TestimonialForm />} />
        </Route>
        
        <Route path="hki">
          <Route index element={<HKIList />} />
          <Route path="new" element={<HKIForm />} />
          <Route path="edit/:id" element={<HKIForm />} />
        </Route>
        
        <Route path="patents">
          <Route index element={<PatentList />} />
          <Route path="new" element={<PatentForm />} />
          <Route path="edit/:id" element={<PatentForm />} />
        </Route>
        
        <Route path="industrial-designs">
          <Route index element={<IndustrialDesignList />} />
          <Route path="new" element={<IndustrialDesignForm />} />
          <Route path="edit/:id" element={<IndustrialDesignForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
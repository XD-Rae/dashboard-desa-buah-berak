import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../../pages/Dashboard';
import FacultyList from '../../pages/faculty/FacultyList';
import FacultyDetail from '../../pages/faculty/FacultyDetail';
import FacultyForm from '../../pages/faculty/FacultyForm';
import AchievementList from '../../pages/achievements/AchievementList';
import AchievementDetail from '../../pages/achievements/AchievementDetail';
import AchievementForm from '../../pages/achievements/AchievementForm';
import EventList from '../../pages/events/EventList';
import EventDetail from '../../pages/events/EventDetail';
import EventForm from '../../pages/events/EventForm';
import PartnerList from '../../pages/partners/PartnerList';
import PartnerForm from '../../pages/partners/PartnerForm';
import TestimonialList from '../../pages/testimonials/TestimonialList';
import TestimonialForm from '../../pages/testimonials/TestimonialForm';
import HKIList from '../../pages/intellectual-property/HKIList';
import HKIForm from '../../pages/intellectual-property/HKIForm';
import PatentList from '../../pages/intellectual-property/PatentList';
import PatentForm from '../../pages/intellectual-property/PatentForm';
import IndustrialDesignList from '../../pages/intellectual-property/IndustrialDesignList';
import IndustrialDesignForm from '../../pages/intellectual-property/IndustrialDesignForm';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyList />} />
              <Route path="/faculty/new" element={<FacultyForm />} />
              <Route path="/faculty/:id" element={<FacultyDetail />} />
              <Route path="/faculty/edit/:id" element={<FacultyForm />} />
              
              {/* Achievement Routes */}
              <Route path="/achievements" element={<AchievementList />} />
              <Route path="/achievements/new" element={<AchievementForm />} />
              <Route path="/achievements/:id" element={<AchievementDetail />} />
              <Route path="/achievements/edit/:id" element={<AchievementForm />} />

              {/* Event Routes */}
              <Route path="/events" element={<EventList />} />
              <Route path="/events/new" element={<EventForm />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/edit/:id" element={<EventForm />} />

              {/* Partner Routes */}
              <Route path="/partners" element={<PartnerList />} />
              <Route path="/partners/new" element={<PartnerForm />} />
              <Route path="/partners/edit/:id" element={<PartnerForm />} />

              {/* Testimonial Routes */}
              <Route path="/testimonials" element={<TestimonialList />} />
              <Route path="/testimonials/new" element={<TestimonialForm />} />
              <Route path="/testimonials/edit/:id" element={<TestimonialForm />} />

              {/* HKI Routes */}
              <Route path="/hki" element={<HKIList />} />
              <Route path="/hki/new" element={<HKIForm />} />
              <Route path="/hki/edit/:id" element={<HKIForm />} />

              {/* Patent Routes */}
              <Route path="/patents" element={<PatentList />} />
              <Route path="/patents/new" element={<PatentForm />} />
              <Route path="/patents/edit/:id" element={<PatentForm />} />

              {/* Industrial Design Routes */}
              <Route path="/industrial-designs" element={<IndustrialDesignList />} />
              <Route path="/industrial-designs/new" element={<IndustrialDesignForm />} />
              <Route path="/industrial-designs/edit/:id" element={<IndustrialDesignForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
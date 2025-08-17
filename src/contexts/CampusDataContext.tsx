import React, { createContext, useContext, useState, useEffect } from 'react';
import { Faculty, Achievement, Event, Partner, Testimonial, HKI, Patent, IndustrialDesign } from '../types';
import { facultyAPI, achievementAPI, eventAPI, partnerAPI, testimonialAPI, hkiAPI, patentAPI, industrialDesignAPI } from '../services/api';
import toast from 'react-hot-toast';

interface CampusDataContextType {
  faculty: Faculty[];
  achievements: Achievement[];
  events: Event[];
  partners: Partner[];
  testimonials: Testimonial[];
  hki: HKI[];
  patents: Patent[];
  industrialDesigns: IndustrialDesign[];
  loading: boolean;
  error: string | null;

  addFaculty: (data: FormData) => Promise<void>;
  updateFaculty: (id: string, data: FormData) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
  getFacultyById: (id: string) => Promise<Faculty | undefined>;

  addAchievement: (data: FormData) => Promise<void>;
  updateAchievement: (id: string, data: FormData) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  getAchievementById: (id: string) => Promise<Achievement | undefined>;

  addEvent: (data: FormData) => Promise<void>;
  updateEvent: (id: string, data: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Promise<Event | undefined>;

  addPartner: (data: FormData) => Promise<void>;
  updatePartner: (id: string, data: FormData) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  getPartnerById: (id: string) => Promise<Partner | undefined>;

  addTestimonial: (data: FormData) => Promise<void>;
  updateTestimonial: (id: string, data: FormData) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  getTestimonialById: (id: string) => Promise<Testimonial | undefined>;

  addHKI: (data: FormData) => Promise<void>;
  updateHKI: (id: string, data: FormData) => Promise<void>;
  deleteHKI: (id: string) => Promise<void>;
  getHKIById: (id: string) => Promise<HKI | undefined>;

  addPatent: (data: FormData) => Promise<void>;
  updatePatent: (id: string, data: FormData) => Promise<void>;
  deletePatent: (id: string) => Promise<void>;
  getPatentById: (id: string) => Promise<Patent | undefined>;

  addIndustrialDesign: (data: FormData) => Promise<void>;
  updateIndustrialDesign: (id: string, data: FormData) => Promise<void>;
  deleteIndustrialDesign: (id: string) => Promise<void>;
  getIndustrialDesignById: (id: string) => Promise<IndustrialDesign | undefined>;

  refreshData: () => Promise<void>;
}

const CampusDataContext = createContext<CampusDataContextType | undefined>(undefined);

export const useCampusData = () => {
  const context = useContext(CampusDataContext);
  if (!context) {
    throw new Error('useCampusData must be used within a CampusDataProvider');
  }
  return context;
};

export const CampusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hki, setHKI] = useState<HKI[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [industrialDesigns, setIndustrialDesigns] = useState<IndustrialDesign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        facultyData,
        achievementsData,
        eventsData,
        partnersData,
        testimonialsData,
        hkiData,
        patentsData,
        industrialDesignsData
      ] = await Promise.all([
        facultyAPI.getAll(),
        achievementAPI.getAll(),
        eventAPI.getAll(),
        partnerAPI.getAll(),
        testimonialAPI.getAll(),
        hkiAPI.getAll(),
        patentAPI.getAll(),
        industrialDesignAPI.getAll()
      ]);
      setFaculty(facultyData);
      setAchievements(achievementsData);
      setEvents(eventsData);
      setPartners(partnersData);
      setTestimonials(testimonialsData);
      setHKI(hkiData);
      setPatents(patentsData);
      setIndustrialDesigns(industrialDesignsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---- Faculty Handlers ----
  const addFaculty = async (data: FormData) => {
    try {
      await facultyAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add faculty');
      throw err;
    }
  };

  const updateFaculty = async (id: string, data: FormData) => {
    try {
      await facultyAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update faculty');
      throw err;
    }
  };

  const deleteFaculty = async (id: string) => {
    try {
      await facultyAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete faculty');
      throw err;
    }
  };

  const getFacultyById = async (id: string): Promise<Faculty | undefined> => {
    try {
      return await facultyAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get faculty details');
      throw err;
    }
  };

  // ---- Achievement Handlers ----
  const addAchievement = async (data: FormData) => {
    try {
      await achievementAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add achievement');
      throw err;
    }
  };

  const updateAchievement = async (id: string, data: FormData) => {
    try {
      await achievementAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update achievement');
      throw err;
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      await achievementAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete achievement');
      throw err;
    }
  };

  const getAchievementById = async (id: string): Promise<Achievement | undefined> => {
    try {
      return await achievementAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get achievement details');
      throw err;
    }
  };

  // ---- Event Handlers ----
  const addEvent = async (data: FormData) => {
    try {
      await eventAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add event');
      throw err;
    }
  };

  const updateEvent = async (id: string, data: FormData) => {
    try {
      await eventAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete event');
      throw err;
    }
  };

  const getEventById = async (id: string): Promise<Event | undefined> => {
    try {
      return await eventAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get event details');
      throw err;
    }
  };

  // ---- Partner Handlers ----
  const addPartner = async (data: FormData) => {
    try {
      await partnerAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add partner');
      throw err;
    }
  };

  const updatePartner = async (id: string, data: FormData) => {
    try {
      await partnerAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update partner');
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await partnerAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete partner');
      throw err;
    }
  };

  const getPartnerById = async (id: string): Promise<Partner | undefined> => {
    try {
      return await partnerAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get partner details');
      throw err;
    }
  };

  // ---- Testimonial Handlers ----
  const addTestimonial = async (data: FormData) => {
    try {
      await testimonialAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add testimonial');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, data: FormData) => {
    try {
      await testimonialAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update testimonial');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await testimonialAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete testimonial');
      throw err;
    }
  };

  const getTestimonialById = async (id: string): Promise<Testimonial | undefined> => {
    try {
      return await testimonialAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get testimonial details');
      throw err;
    }
  };

  // ---- HKI Handlers ----
  const addHKI = async (data: FormData) => {
    try {
      await hkiAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add HKI');
      throw err;
    }
  };

  const updateHKI = async (id: string, data: FormData) => {
    try {
      await hkiAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update HKI');
      throw err;
    }
  };

  const deleteHKI = async (id: string) => {
    try {
      await hkiAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete HKI');
      throw err;
    }
  };

  const getHKIById = async (id: string): Promise<HKI | undefined> => {
    try {
      return await hkiAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get HKI details');
      throw err;
    }
  };

  // ---- Patent Handlers ----
  const addPatent = async (data: FormData) => {
    try {
      await patentAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add patent');
      throw err;
    }
  };

  const updatePatent = async (id: string, data: FormData) => {
    try {
      await patentAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update patent');
      throw err;
    }
  };

  const deletePatent = async (id: string) => {
    try {
      await patentAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete patent');
      throw err;
    }
  };

  const getPatentById = async (id: string): Promise<Patent | undefined> => {
    try {
      return await patentAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get patent details');
      throw err;
    }
  };

  // ---- Industrial Design Handlers ----
  const addIndustrialDesign = async (data: FormData) => {
    try {
      await industrialDesignAPI.create(data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to add industrial design');
      throw err;
    }
  };

  const updateIndustrialDesign = async (id: string, data: FormData) => {
    try {
      await industrialDesignAPI.update(id, data);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update industrial design');
      throw err;
    }
  };

  const deleteIndustrialDesign = async (id: string) => {
    try {
      await industrialDesignAPI.delete(id);
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete industrial design');
      throw err;
    }
  };

  const getIndustrialDesignById = async (id: string): Promise<IndustrialDesign | undefined> => {
    try {
      return await industrialDesignAPI.getById(id);
    } catch (err) {
      toast.error('Failed to get industrial design details');
      throw err;
    }
  };

  const value: CampusDataContextType = {
    faculty,
    achievements,
    events,
    partners,
    testimonials,
    hki,
    patents,
    industrialDesigns,
    loading,
    error,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyById,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementById,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    addPartner,
    updatePartner,
    deletePartner,
    getPartnerById,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    addHKI,
    updateHKI,
    deleteHKI,
    getHKIById,
    addPatent,
    updatePatent,
    deletePatent,
    getPatentById,
    addIndustrialDesign,
    updateIndustrialDesign,
    deleteIndustrialDesign,
    getIndustrialDesignById,
    refreshData: fetchData,
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <CampusDataContext.Provider value={value}>
      {children}
    </CampusDataContext.Provider>
  );
};
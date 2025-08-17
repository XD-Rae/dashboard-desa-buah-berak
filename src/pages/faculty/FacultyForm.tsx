import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCampusData } from '../../contexts/CampusDataContext';
import { ArrowLeft, Plus, Trash2, Upload, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Faculty, Publication, HKI, CommunityService } from '../../types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const emptyFaculty: Faculty = {
  _id: '',
  name: '',
  nidn: '',
  fields: [],
  position: 'Aparatur',
  email: '',
  
  foto: '',
  education: [],
  courses: [],
  publications: [],
  hki: [],
  pengabdian: []
};

const emptyPublication: Publication = {
  title: '',
  year: '',
  link: ''
};

const emptyHKI: HKI = {
  judulHKI: '',
  tanggalHKI: '',
  nomorHKI: '',
  linkDriveHKI: ''
};

const emptyCommunityService: CommunityService = {
  judulPengabdian: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  deskripsi: '',
  gambarPengabdian: []
};

type ResearchTab = 'publications' | 'hki' | 'pengabdian';

const FacultyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addFaculty, updateFaculty, getFacultyById, faculty } = useCampusData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [facultyData, setFacultyData] = useState<Faculty>(emptyFaculty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newField, setNewField] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [tempEducation, setTempEducation] = useState<Education>({ degree: '', institution: '', year: '' });
  const [activeTab, setActiveTab] = useState<ResearchTab>('publications');
  const [tempPublication, setTempPublication] = useState<Publication>(emptyPublication);
  const [tempHKI, setTempHKI] = useState<HKI>(emptyHKI);
  const [tempCommunityService, setTempCommunityService] = useState<CommunityService>(emptyCommunityService);
  const [hkiDate, setHKIDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const communityServiceImagesRef = useRef<HTMLInputElement>(null);
  const [editingPublication, setEditingPublication] = useState<string | null>(null);
  const [editingHKI, setEditingHKI] = useState<string | null>(null);
  const [editingPengabdian, setEditingPengabdian] = useState<string | null>(null);
  
  const existingFields = Array.from(new Set(faculty.flatMap(f => f.fields)));
  const existingCourses = Array.from(new Set(faculty.flatMap(f => f.courses || [])));
  
  const filteredFields = existingFields.filter(field => 
    field.toLowerCase().includes(newField.toLowerCase()) &&
    !facultyData.fields?.includes(field)
  );
  
  const filteredCourses = existingCourses.filter(course => 
    course.toLowerCase().includes(newCourse.toLowerCase()) &&
    !facultyData.courses?.includes(course)
  );
  
  const isEditing = !!id;

  // Generate years array from current year to 2005
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2004 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (isEditing && id) {
        try {
          const existingFaculty = await getFacultyById(id);
          if (existingFaculty) {
            setFacultyData({ ...existingFaculty, position: 'Aparatur' });
            if (existingFaculty.foto) {
              setImagePreview(existingFaculty.foto);
            }
          } else {
            navigate('/faculty');
            toast.error('Aparatur tidak ditemukan');
          }
        } catch (error) {
          console.error('Error fetching faculty:', error);
          toast.error('Gagal memuat data Aparatur');
        }
      }
    };

    fetchFacultyData();
  }, [id, getFacultyById, navigate, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar. Maksimal 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFacultyData(prev => ({ ...prev, foto: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddField = (field: string = newField.trim()) => {
    if (field && !facultyData.fields?.includes(field)) {
      setFacultyData(prev => ({
        ...prev,
        fields: [...(prev.fields || []), field]
      }));
      setNewField('');
      setShowFieldSuggestions(false);
      setErrors(prev => ({ ...prev, fields: undefined }));
    }
  };

  const handleAddCourse = (course: string = newCourse.trim()) => {
    if (course && !facultyData.courses?.includes(course)) {
      setFacultyData(prev => ({
        ...prev,
        courses: [...(prev.courses || []), course]
      }));
      setNewCourse('');
      setShowCourseSuggestions(false);
      setErrors(prev => ({ ...prev, courses: undefined }));
    }
  };

  const handleRemoveField = (index: number) => {
    setFacultyData((prev) => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!facultyData.name.trim()) newErrors.name = 'Nama Aparatur wajib diisi';
    if (!facultyData.nidn.trim()) newErrors.nidn = 'NIK wajib diisi';
    if (!facultyData.fields || facultyData.fields.length === 0) newErrors.fields = 'Jabatan wajib diisi';
    if (!facultyData.position.trim()) newErrors.position = 'Posisi wajib diisi';
    if (!facultyData.education || facultyData.education.length === 0) newErrors.education = 'Pendidikan wajib diisi';
    if (!facultyData.courses || facultyData.courses.length === 0) newErrors.courses = 'Alamat wajib diisi';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!facultyData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(facultyData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFacultyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveCourse = (index: number) => {
    setFacultyData((prev) => ({
      ...prev,
      courses: prev.courses?.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    if (tempEducation.degree.trim() !== '' && tempEducation.institution.trim() !== '') {
      setFacultyData((prev) => ({
        ...prev,
        education: [...(prev.education || []), { ...tempEducation }]
      }));
      setTempEducation({ degree: '', institution: '', year: '', field: '' });
      setErrors(prev => ({ ...prev, education: undefined }));
    }
  };

  const handleRemoveEducation = (index: number) => {
    setFacultyData((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  const handleAddPublication = () => {
    if (tempPublication.title.trim() && tempPublication.year.trim()) {
      if (editingPublication !== null) {
        // Update existing publication
        setFacultyData(prev => ({
          ...prev,
          publications: prev.publications?.map((pub, index) => 
            index === parseInt(editingPublication) ? { ...tempPublication } : pub
          ) || []
        }));
        setEditingPublication(null);
      } else {
        // Add new publication
        setFacultyData(prev => ({
          ...prev,
          publications: [...(prev.publications || []), { ...tempPublication }]
        }));
      }
      setTempPublication(emptyPublication);
    }
  };

  const handleEditPublication = (index: number) => {
    const publication = facultyData.publications?.[index];
    if (publication) {
      setTempPublication(publication);
      setEditingPublication(index.toString());
    }
  };

  const handleCancelEditPublication = () => {
    setTempPublication(emptyPublication);
    setEditingPublication(null);
  };

  const handleRemovePublication = (index: number) => {
    setFacultyData(prev => ({
      ...prev,
      publications: prev.publications?.filter((_, i) => i !== index)
    }));
  };

  const handleAddHKI = () => {
    if (tempHKI.judulHKI.trim() && tempHKI.nomorHKI.trim() && hkiDate) {
      const newHKI = {
        ...tempHKI,
        tanggalHKI: hkiDate.toISOString()
      };

      if (editingHKI !== null) {
        // Update existing HKI
        setFacultyData(prev => ({
          ...prev,
          hki: prev.hki?.map((item, index) => 
            index === parseInt(editingHKI) ? newHKI : item
          ) || []
        }));
        setEditingHKI(null);
      } else {
        // Add new HKI
        setFacultyData(prev => ({
          ...prev,
          hki: [...(prev.hki || []), newHKI]
        }));
      }
      setTempHKI(emptyHKI);
      setHKIDate(null);
    }
  };

  const handleEditHKI = (index: number) => {
    const hki = facultyData.hki?.[index];
    if (hki) {
      setTempHKI(hki);
      setHKIDate(new Date(hki.tanggalHKI));
      setEditingHKI(index.toString());
    }
  };

  const handleCancelEditHKI = () => {
    setTempHKI(emptyHKI);
    setHKIDate(null);
    setEditingHKI(null);
  };

  const handleRemoveHKI = (index: number) => {
    setFacultyData(prev => ({
      ...prev,
      hki: prev.hki?.filter((_, i) => i !== index)
    }));
  };

  const handleCommunityServiceImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 10) {
      toast.error('Maksimal 10 gambar yang dapat diunggah');
      return;
    }
  
    const processImage = async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          reject('Ukuran file terlalu besar. Maksimal 5MB');
          return;
        }
  
        if (!file.type.startsWith('image/')) {
          reject('File harus berupa gambar');
          return;
        }
  
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = () => reject('Error membaca file');
        reader.readAsDataURL(file);
      });
    };
  
    try {
      const base64Images = await Promise.all(files.map(processImage));
      setTempCommunityService(prev => ({
        ...prev,
        gambarPengabdian: [...prev.gambarPengabdian, ...base64Images]
      }));
    } catch (error) {
      toast.error(error as string);
    }
  };
  

  const handleAddCommunityService = () => {
    if (
      tempCommunityService.judulPengabdian.trim() &&
      startDate &&
      endDate &&
      tempCommunityService.deskripsi.trim()
    ) {
      const newService = {
        ...tempCommunityService,
        tanggalMulai: startDate.toISOString(),
        tanggalSelesai: endDate.toISOString()
      };

      if (editingPengabdian !== null) {
        // Update existing community service
        setFacultyData(prev => ({
          ...prev,
          pengabdian: prev.pengabdian?.map((item, index) => 
            index === parseInt(editingPengabdian) ? newService : item
          ) || []
        }));
        setEditingPengabdian(null);
      } else {
        // Add new community service
        setFacultyData(prev => ({
          ...prev,
          pengabdian: [...(prev.pengabdian || []), newService]
        }));
      }
      setTempCommunityService(emptyCommunityService);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleEditCommunityService = (index: number) => {
    const service = facultyData.pengabdian?.[index];
    if (service) {
      setTempCommunityService(service);
      setStartDate(new Date(service.tanggalMulai));
      setEndDate(new Date(service.tanggalSelesai));
      setEditingPengabdian(index.toString());
    }
  };

  const handleCancelEditCommunityService = () => {
    setTempCommunityService(emptyCommunityService);
    setStartDate(null);
    setEndDate(null);
    setEditingPengabdian(null);
  };

  const handleRemoveCommunityService = (index: number) => {
    setFacultyData(prev => ({
      ...prev,
      pengabdian: prev.pengabdian?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validate()) {
      toast.error('Harap perbaiki semua error pada form');
      return;
    }
  
    const submittedData = { ...facultyData, position: 'Aparatur' };
  
    try {
      if (isEditing && id) {
        await updateFaculty(id, submittedData);
        toast.success('Data Aparatur berhasil diperbarui');
      } else {
        await addFaculty(submittedData);
        toast.success('Data Aparatur berhasil ditambahkan');
      }
      navigate('/faculty');
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error('Gagal menyimpan data Aparatur');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/faculty" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Data Aparatur' : 'Tambah Aparatur Baru'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Profile Image */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <div className="relative h-32 w-32">
                    {imagePreview ? (
                      <img
                        className="h-32 w-32 object-cover rounded-full"
                        src={imagePreview}
                        alt="Profile preview"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Pilih Foto
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={facultyData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="nidn" className="block text-sm font-medium text-gray-700">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nidn"
                    name="nidn"
                    value={facultyData.nidn}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.nidn ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.nidn && <p className="mt-1 text-sm text-red-600">{errors.nidn}</p>}
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value="AKTIF"
                    readOnly
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Jabatan <span className="text-red-500">*</span></h2>
              <div className="mb-4">
                {facultyData.fields && facultyData.fields.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {facultyData.fields.map((field, index) => (
                      <div key={index} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1">
                        <span className="text-sm font-medium text-blue-800">{field}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="ml-1 rounded-full p-1 text-blue-700 hover:bg-blue-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="relative flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newField}
                      onChange={(e) => {
                        setNewField(e.target.value);
                        setShowFieldSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddField();
                        }
                      }}
                      placeholder="Ketik Jabatan Aparatur"
                      className={`block w-full rounded-md border ${
                        errors.fields ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    
                    {showFieldSuggestions && newField && filteredFields.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                        <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                          {filteredFields.map((field, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-3 py-2 hover:bg-blue-50"
                              onClick={() => handleAddField(field)}
                            >
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleAddField()}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Tambah
                  </button>
                </div>
                {errors.fields && <p className="mt-1 text-sm text-red-600">{errors.fields}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={facultyData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
              </div>
            </div>

            {/* Courses */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Alamat <span className="text-red-500">*</span></h2>
              <div className="mb-4">
                {facultyData.courses && facultyData.courses.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {facultyData.courses.map((course, index) => (
                      <div key={index} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1">
                        <span className="text-sm font-medium text-blue-800">{course}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(index)}
                          className="ml-1 rounded-full p-1 text-blue-700 hover:bg-blue-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="relative flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newCourse}
                      onChange={(e) => {
                        setNewCourse(e.target.value);
                        setShowCourseSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCourse();
                        }
                      }}
                      placeholder="Ketik Alamat baru"
                      className={`block w-full rounded-md border ${
                        errors.courses ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    
                    {showCourseSuggestions && newCourse && filteredCourses.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                        <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                          {filteredCourses.map((course, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-3 py-2 hover:bg-blue-50"
                              onClick={() => handleAddCourse(course)}
                            >
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleAddCourse()}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Tambah
                  </button>
                </div>
                {errors.courses && <p className="mt-1 text-sm text-red-600">{errors.courses}</p>}
              </div>
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lain-lain <span className="text-red-500">*</span></h2>
              <div className="mb-4">
                {facultyData.education && facultyData.education.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {facultyData.education.map((edu, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution} ({edu.year})</p>
                          {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(index)}
                          className="rounded-full p-1 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="rounded-md border border-gray-300 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="educationDegree" className="block text-sm font-medium text-gray-700">
                        Jenjang Pendidikan <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="educationDegree"
                        name="educationDegree"
                        value={tempEducation.degree}
                        onChange={(e) =>
                          setTempEducation((prev) => ({ ...prev, degree: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Pilih Jenjang</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                        <option value="D3">D3</option>
                        <option value="SMA/SMK">SMA/SMK</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="educationInstitution" className="block text-sm font-medium text-gray-700">
                        Agama <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="educationInstitution"
                        value={tempEducation.institution}
                        onChange={(e) => setTempEducation({ ...tempEducation, institution: e.target.value })}
                        placeholder="Nama universitas"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="educationYear" className="block text-sm font-medium text-gray-700">
                        Tahun <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="educationYear"
                        value={tempEducation.year}
                        onChange={(e) => setTempEducation({ ...tempEducation, year: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="educationField" className="block text-sm font-medium text-gray-700">
                        Tempat, Tanggal Lahir<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="educationField"
                        value={tempEducation.field || ''}
                        onChange={(e) => setTempEducation({ ...tempEducation, field: e.target.value })}
                        placeholder="Bidang studi"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      <Plus size={16} className="mr-2" />
                      Tambah Data
                    </button>
                  </div>
                </div>
                {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
              </div>
            </div>

            {/* Research Tabs */}
            <div className="md:col-span-2">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab('publications')}
                    className={`${
                      activeTab === 'publications'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                  >
                    Publikasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hki')}
                    className={`${
                      activeTab === 'hki'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                  >
                    HKI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pengabdian')}
                    className={`${
                      activeTab === 'pengabdian'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                  >
                    Pengabdian Masyarakat
                  </button>
                </nav>
              </div>

              <div className="mt-6">
                {/* Publications Tab */}
                {activeTab === 'publications' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Publikasi</h3>
                    
                    {facultyData.publications && facultyData.publications.length > 0 && (
                      <div className="mb-4 space-y-3">
                        {facultyData.publications.map((pub, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                            <div className="flex-1 pr-4">
                              <p className="font-medium">{pub.title}</p>
                              <p className="text-sm text-gray-600">Tahun: {pub.year}</p>
                              {pub.link && (
                                <a
                                  href={pub.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                  Lihat Publikasi
                                </a>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditPublication(index)}
                                className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePublication(index)}
                                className="rounded-full p-1 text-red-600 hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-md border border-gray-300 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Judul Publikasi
                          </label>
                          <input
                            type="text"
                            value={tempPublication.title}
                            onChange={(e) => setTempPublication({ ...tempPublication, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tahun Publikasi
                          </label>
                          <select
                            value={tempPublication.year}
                            onChange={(e) => setTempPublication({ ...tempPublication, year: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          >
                            <option value="">Pilih Tahun</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Link Publikasi
                          </label>
                          <input
                            type="url"
                            value={tempPublication.link}
                            onChange={(e) => setTempPublication({ ...tempPublication, link: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        {editingPublication !== null && (
                          <button
                            type="button"
                            onClick={handleCancelEditPublication}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <X size={16} className="mr-2" />
                            Batal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddPublication}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                        >
                          {editingPublication !== null ? (
                            <>
                              <Edit size={16} className="mr-2" />
                              Update Publikasi
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" />
                              Tambah Publikasi
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* HKI Tab */}
                {activeTab === 'hki' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data HKI</h3>
                    
                    {facultyData.hki && facultyData.hki.length > 0 && (
                      <div className="mb-4 space-y-3">
                        {facultyData.hki.map((item, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                            <div className="flex-1 pr-4">
                              <p className="font-medium">{item.judulHKI}</p>
                              <p className="text-sm text-gray-600">
                                Nomor: {item.nomorHKI} | Tanggal: {new Date(item.tanggalHKI).toLocaleDateString('id-ID')}
                              </p>
                              {item.linkDriveHKI && (
                                <a
                                  href={item.linkDriveHKI}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                  Lihat Dokumen
                                </a>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditHKI(index)}
                                className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveHKI(index)}
                                className="rounded-full p-1 text-red-600 hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-md border border-gray-300 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Judul HKI
                          </label>
                          <input
                            type="text"
                            value={tempHKI.judulHKI}
                            onChange={(e) => setTempHKI({ ...tempHKI, judulHKI: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tanggal HKI
                          </label>
                          <DatePicker
                            selected={hkiDate}
                            onChange={(date) => setHKIDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholderText="Pilih tanggal"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nomor HKI
                          </label>
                          <input
                            type="text"
                            value={tempHKI.nomorHKI}
                            onChange={(e) => setTempHKI({ ...tempHKI, nomorHKI: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Link Drive HKI
                          </label>
                          <input
                            type="url"
                            value={tempHKI.linkDriveHKI}
                            onChange={(e) => setTempHKI({ ...tempHKI, linkDriveHKI: e.target.value })}
                            placeholder="https://drive.google.com/..."
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        {editingHKI !== null && (
                          <button
                            type="button"
                            onClick={handleCancelEditHKI}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <X size={16} className="mr-2" />
                            Batal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddHKI}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                        >
                          {editingHKI !== null ? (
                            <>
                              <Edit size={16} className="mr-2" />
                              Update HKI
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" />
                              Tambah HKI
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Community Service Tab */}
                {activeTab === 'pengabdian' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Pengabdian Masyarakat</h3>
                    
                    {facultyData.pengabdian && facultyData.pengabdian.length > 0 && (
                      <div className="mb-4 space-y-6">
                        {facultyData.pengabdian.map((item, index) => (
                          <div key={index} className="flex items-start justify-between rounded-md bg-gray-50 p-3">
                            <div className="flex-1 pr-4">
                              <p className="font-medium">{item.judulPengabdian}</p>
                              <p className="text-sm text-gray-600">
                                {item.tanggalMulai} s/d {item.tanggalSelesai}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">{item.deskripsi}</p>
                              {item.gambarPengabdian.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {item.gambarPengabdian.map((img, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={img}
                                      alt={`Dokumentasi ${imgIndex + 1}`}
                                      className="h-20 w-20 object-cover rounded"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditCommunityService(index)}
                                className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveCommunityService(index)}
                                className="rounded-full p-1 text-red-600 hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-md border border-gray-300 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Judul Pengabdian
                          </label>
                          <input
                            type="text"
                            value={tempCommunityService.judulPengabdian}
                            onChange={(e) => setTempCommunityService({
                              ...tempCommunityService,
                              judulPengabdian: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tanggal Mulai
                          </label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholderText="Pilih tanggal mulai"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tanggal Selesai
                          </label>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholderText="Pilih tanggal selesai"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Deskripsi
                          </label>
                          <textarea
                            value={tempCommunityService.deskripsi}
                            onChange={(e) => setTempCommunityService({
                              ...tempCommunityService,
                              deskripsi: e.target.value
                            })}
                            rows={4}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Gambar Dokumentasi
                          </label>
                          <input
                            type="file"
                            ref={communityServiceImagesRef}
                            onChange={handleCommunityServiceImageChange}
                            multiple
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-indigo-50 file:text-indigo-700
                              hover:file:bg-indigo-100"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Maksimal 10 gambar, masing-masing maksimal 5MB
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        {editingPengabdian !== null && (
                          <button
                            type="button"
                            onClick={handleCancelEditCommunityService}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <X size={16} className="mr-2" />
                            Batal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddCommunityService}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                        >
                          {editingPengabdian !== null ? (
                            <>
                              <Edit size={16} className="mr-2" />
                              Update Pengabdian
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" />
                              Tambah Pengabdian
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              to="/faculty"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? 'Perbarui Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyForm;
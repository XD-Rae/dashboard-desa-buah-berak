// -------- User Types --------
export interface User {
  username: string;
  role: 'admin' | 'dosen';
}
// -------- Faculty Related Types --------

export interface Faculty {
  _id: string;
  name: string;
  nidn: string;
  fields: string[]; // e.g., ["AI", "IoT"]
  position: string;
  foto?: string;
  email: string;
  
  education?: Education[];
  courses?: string[];
  publications?: Publication[];
  hki?: HKI[];
  pengabdian?: CommunityService[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  _id?: string;
  degree: string;         // e.g., "S1", "S2", "PhD"
  institution: string;    // e.g., "Universitas ABC"
  year: string;           // e.g., "2020"
  field?: string;         // optional: "Computer Science"
}

export interface Publication {
  _id?: string;
  title: string;
  year: string;
  link?: string;
}

export interface HKI {
  _id?: string;
  judulHKI: string;
  tanggalHKI: string;
  nomorHKI: string;
  linkDriveHKI?: string;
}

export interface CommunityService {
  _id?: string;
  judulPengabdian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  deskripsi: string;
  gambarPengabdian: string[];
}

// -------- Achievement Type --------

export interface Achievement {
  _id: string;
  judul: string;
  tahun: string;
  mahasiswa: string[];     // array of names
  deskripsi: string;
  foto: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------- Event Type --------

export interface Event {
  _id: string;
  nama: string;
  foto: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  jenis: string;           // e.g., "Seminar", "Workshop"
  createdAt?: string;
  updatedAt?: string;
}

// -------- Partner Type --------

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------- Testimonial Type --------

export interface Testimonial {
  _id: string;
  name: string;
  tahunlulus: string;
  pekerjaan: string;
  perusahaan: string;
  image: string;
  testimoni: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------- Intellectual Property Types --------

export interface IntellectualProperty {
  _id: string;
  title: string;
  date: string;
  number: string;
  authors: string[];
  driveUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HKI extends IntellectualProperty {}
export interface Patent extends IntellectualProperty {}
export interface IndustrialDesign extends IntellectualProperty {}
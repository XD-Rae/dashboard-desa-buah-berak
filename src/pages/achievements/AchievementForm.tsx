import React, {useState, useEffect, useRef} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {useDataContext} from "../../contexts/DataContext";
import {ArrowLeft, Plus, Trash2, Upload} from "lucide-react";
import toast from "react-hot-toast";
import {Achievement} from "../../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";

const emptyAchievement: Achievement = {
  _id: "",
  judul: "",
  tahun: "",
  mahasiswa: [],
  deskripsi: "",
  foto: "",
};

const AchievementForm: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {addAchievement, updateAchievement, getAchievementById} =
    useDataContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [achievement, setAchievement] = useState<Achievement>(emptyAchievement);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newStudent, setNewStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id) {
        try {
          const existingAchievement = await getAchievementById(id);
          if (existingAchievement) {
            setAchievement(existingAchievement);
            setImagePreview(existingAchievement.foto);
            // Parse the date string to Date object
            const dateParts = existingAchievement.tahun.split(" ");
            if (dateParts.length === 3) {
              const months = {
                Januari: 0,
                Februari: 1,
                Maret: 2,
                April: 3,
                Mei: 4,
                Juni: 5,
                Juli: 6,
                Agustus: 7,
                September: 8,
                Oktober: 9,
                November: 10,
                Desember: 11,
              };
              const day = parseInt(dateParts[0]);
              const month = months[dateParts[1] as keyof typeof months];
              const year = parseInt(dateParts[2]);
              setSelectedDate(new Date(year, month, day));
            }
          } else {
            navigate("/achievements");
            toast.error("Prestasi tidak ditemukan");
          }
        } catch (error) {
          console.error("Error fetching achievement:", error);
          toast.error("Gagal mengambil data prestasi");
          navigate("/achievements");
        }
      }
    };

    fetchData();
  }, [id, getAchievementById, navigate, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setAchievement((prev) => ({...prev, foto: base64}));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date: Date): string => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!achievement.judul.trim()) newErrors.judul = "Judul i wajib diisi";
    if (!selectedDate) newErrors.tahun = "Tanggal prestasi wajib diisi";
    if (achievement.mahasiswa.length === 0)
      newErrors.mahasiswa = "Minimal satu prestasi wajib diisi";
    if (!achievement.deskripsi.trim())
      newErrors.deskripsi = "Deskripsi prestasi wajib diisi";
    if (!achievement.foto) newErrors.foto = "Foto prestasi wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target;
    setAchievement((prev) => ({...prev, [name]: value}));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setAchievement((prev) => ({
        ...prev,
        tahun: formatDate(date),
      }));
    }
  };

  const handleAddStudent = () => {
    if (newStudent.trim() !== "") {
      setAchievement((prev) => ({
        ...prev,
        mahasiswa: [...prev.mahasiswa, newStudent.trim()],
      }));
      setNewStudent("");
    }
  };

  const handleRemoveStudent = (index: number) => {
    setAchievement((prev) => ({
      ...prev,
      mahasiswa: prev.mahasiswa.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Periksa kembali inputan!");
      return;
    }
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (isEditing && id) {
        await updateAchievement(id, achievement);
        toast.success("Prestasi berhasil diperbarui");
      } else {
        await addAchievement(achievement);
        toast.success("Prestasi berhasil ditambahkan");
      }
      navigate("/achievements");
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link
          to="/achievements"
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Prestasi" : "Tambah Prestasi Baru"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Achievement Image */}
            <div>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <div className="relative h-48 w-48">
                    {imagePreview ? (
                      <img
                        className="h-48 w-48 object-cover rounded-lg"
                        src={imagePreview}
                        alt="Achievement preview"
                      />
                    ) : (
                      <div className="h-48 w-48 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Foto Prestasi
                  </label>
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
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {errors.foto && (
                    <p className="mt-1 text-sm text-red-600">{errors.foto}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="judul"
                className="block text-sm font-medium text-gray-700"
              >
                Judul Prestasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                value={achievement.judul}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.judul ? "border-red-300" : "border-gray-300"
                } px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.judul && (
                <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="tahun"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="d MMMM yyyy"
                className={`mt-1 block w-full rounded-md border ${
                  errors.tahun ? "border-red-300" : "border-gray-300"
                } px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholderText="Pilih tanggal"
              />
              {errors.tahun && (
                <p className="mt-1 text-sm text-red-600">{errors.tahun}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Desa <span className="text-red-500">*</span>
              </label>

              {achievement.mahasiswa.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {achievement.mahasiswa.map((student, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1"
                    >
                      <span className="text-sm font-medium text-indigo-800">
                        {student}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(index)}
                        className="ml-1 rounded-full p-1 text-indigo-700 hover:bg-indigo-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex">
                <input
                  type="text"
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddStudent();
                    }
                  }}
                  placeholder="Nama Desa"
                  className={`block w-full rounded-l-md border ${
                    errors.mahasiswa ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="inline-flex items-center rounded-r-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Plus size={16} className="mr-2" />
                  Tambah
                </button>
              </div>
              {errors.mahasiswa && (
                <p className="mt-1 text-sm text-red-600">{errors.mahasiswa}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-gray-700"
              >
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                value={achievement.deskripsi}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.deskripsi ? "border-red-300" : "border-gray-300"
                } px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.deskripsi && (
                <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              to="/achievements"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? "Perbarui Prestasi" : "Simpan Prestasi"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationDialog
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan"
        message={`Apakah Anda yakin ingin ${
          isEditing ? "memperbarui" : "menyimpan"
        } prestasi ini?`}
        confirmLabel={isEditing ? "Perbarui" : "Simpan"}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};

export default AchievementForm;

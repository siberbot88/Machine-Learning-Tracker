import { useAuth } from '../context/AuthContext';

const translations = {
  en: {
    dashboard: 'Dashboard',
    roadmap: 'Roadmap',
    weeklyReviews: 'Weekly Reviews',
    profile: 'Profile',
    logout: 'Logout',
    welcomeBack: 'Welcome back',
    online: 'Online',
    searchTasks: 'Search tasks...',
    allWeeks: 'All Weeks',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    allPriorities: 'All Priorities',
    week: 'Week',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    done: 'Done',
    blocked: 'Blocked',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    required: 'Required',
    due: 'Due',
    noTasks: 'No tasks found matching your filters.',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    dimmed: 'Dimmed',
    name: 'Name',
  },
  id: {
    dashboard: 'Dasbor',
    roadmap: 'Peta Jalan',
    weeklyReviews: 'Ulasan Mingguan',
    profile: 'Profil',
    logout: 'Keluar',
    welcomeBack: 'Selamat datang kembali',
    online: 'Daring',
    searchTasks: 'Cari tugas...',
    allWeeks: 'Semua Minggu',
    allCategories: 'Semua Kategori',
    allStatuses: 'Semua Status',
    allPriorities: 'Semua Prioritas',
    week: 'Minggu',
    notStarted: 'Belum Dimulai',
    inProgress: 'Sedang Proses',
    done: 'Selesai',
    blocked: 'Terblokir',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
    required: 'Wajib',
    due: 'Batas',
    noTasks: 'Tidak ada tugas yang sesuai dengan filter.',
    saveChanges: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    settings: 'Pengaturan',
    language: 'Bahasa',
    theme: 'Tema',
    light: 'Terang',
    dark: 'Gelap',
    dimmed: 'Redup',
    name: 'Nama',
  }
} as const;

type Language = keyof typeof translations;
type TranslationKeys = keyof typeof translations.en;

export function useTranslation() {
  const { user } = useAuth();
  const lang: Language = (user?.language as Language) || 'en';

  const t = (key: TranslationKeys) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { t, lang };
}

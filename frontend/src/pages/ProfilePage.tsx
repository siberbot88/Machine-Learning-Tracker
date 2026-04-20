import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { UserCircle, Palette, Globe, Monitor, Moon, Save, Sunset } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  
  const [name, setName] = useState(user?.name || '');
  const [theme, setTheme] = useState<'light' | 'dark' | 'dimmed'>(user?.theme || 'light');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const updatedUser = await updateProfile({ name, theme, language });
      updateUser(updatedUser);
      setMessage('Profile settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    { id: 'light', label: t('light'), icon: Monitor, description: 'Default bright appearance' },
    { id: 'dimmed', label: t('dimmed'), icon: Sunset, description: 'Softer night-time appearance' },
    { id: 'dark', label: t('dark'), icon: Moon, description: 'True dark mode for OLEDs' },
  ];

  return (
    <div className="max-w-4xl space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-text">{t('profile')} & {t('settings')}</h1>
        <p className="text-text-muted mt-1">Manage your account preferences and application appearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
              <UserCircle className="w-5 h-5 text-primary" /> {t('profile')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt text-text-muted cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-text-muted">Email cannot be changed.</p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" /> {t('language')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === 'en' 
                    ? 'border-primary bg-primary-50 ring-1 ring-primary' 
                    : 'border-border hover:border-text-muted bg-surface'
                }`}
              >
                <div className="font-medium text-text">English</div>
                <div className="text-xs text-text-muted mt-1">Default application language</div>
              </button>
              
              <button
                onClick={() => setLanguage('id')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === 'id' 
                    ? 'border-primary bg-primary-50 ring-1 ring-primary' 
                    : 'border-border hover:border-text-muted bg-surface'
                }`}
              >
                <div className="font-medium text-text">Bahasa Indonesia</div>
                <div className="text-xs text-text-muted mt-1">Terjemahan antarmuka aplikasi</div>
              </button>
            </div>
          </div>

          {/* Theme Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" /> {t('theme')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      theme === opt.id 
                        ? 'border-primary bg-primary-50 ring-1 ring-primary' 
                        : 'border-border hover:border-text-muted bg-surface'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${theme === opt.id ? 'text-primary' : 'text-text-muted'}`} />
                    <div className="font-medium text-text">{opt.label}</div>
                    <div className="text-xs text-text-muted mt-1">{opt.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className={`text-sm font-medium ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
              {message}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isSaving ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Live Preview</h3>
            
            <div className="p-4 rounded-xl bg-surface-alt border border-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-text">{name || 'Your Name'}</div>
                  <div className="text-xs text-text-muted">{user?.email}</div>
                </div>
              </div>
              
              <div className="pt-3 mt-3 border-t border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Current Theme:</span>
                  <span className="font-medium text-primary capitalize">{theme}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-text-muted">Language selected:</span>
                  <span className="font-medium text-primary uppercase">{language}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              {t('online')} / {t('dashboard')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getWeeklyReviews, createWeeklyReview, updateWeeklyReview, generateAiFeedback } from '../api/weeklyReviews';
import type { WeeklyReview } from '../types';
import { Loader2, Save, Star, Trophy, Wrench, BookOpen, Bot, Sparkles } from 'lucide-react';
import { WEEK_CATEGORIES } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export default function WeeklyReviewPage() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [form, setForm] = useState({
    focus_this_week: '',
    main_wins: '',
    main_difficulties: '',
    hours_spent: '',
    confidence_level: 3,
    next_week_plan: '',
  });
  const [saving, setSaving] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await getWeeklyReviews();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  useEffect(() => {
    const existing = reviews.find(r => r.week_number === selectedWeek);
    if (existing) {
      setForm({
        focus_this_week: existing.focus_this_week || '',
        main_wins: existing.main_wins || '',
        main_difficulties: existing.main_difficulties || '',
        hours_spent: existing.hours_spent?.toString() || '',
        confidence_level: existing.confidence_level || 3,
        next_week_plan: existing.next_week_plan || '',
      });
    } else {
      setForm({
        focus_this_week: '',
        main_wins: '',
        main_difficulties: '',
        hours_spent: '',
        confidence_level: 3,
        next_week_plan: '',
      });
    }
  }, [selectedWeek, reviews]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = reviews.find(r => r.week_number === selectedWeek);
      const payload = {
        week_number: selectedWeek,
        ...form,
        hours_spent: form.hours_spent ? parseFloat(form.hours_spent) : null,
      };

      if (existing) {
        await updateWeeklyReview(existing.id, payload);
      } else {
        await createWeeklyReview(payload);
      }
      await fetchReviews();
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAi = async (reviewId: string) => {
    setGeneratingAi(true);
    try {
      await generateAiFeedback(reviewId);
      await fetchReviews();
    } catch (err) {
      console.error('Failed to generate AI feedback:', err);
      alert('Failed to generate AI feedback. Make sure your DeepSeek API Key is set.');
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const existingReview = reviews.find(r => r.week_number === selectedWeek);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Weekly Reviews</h1>
        <p className="text-sm text-text-muted mt-1">Reflect on your learning journey each week</p>
      </div>

      {/* Week selector */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
          const hasReview = reviews.some(r => r.week_number === w);
          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedWeek === w
                  ? 'bg-primary text-white shadow-sm'
                  : hasReview
                    ? 'bg-accent-light text-accent border border-accent/20'
                    : 'bg-surface border border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              W{w}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Review form */}
        <div className="xl:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text">Week {selectedWeek} Review</h3>
              <p className="text-xs text-text-muted">{WEEK_CATEGORIES[selectedWeek - 1]}</p>
            </div>
            {existingReview && (
              <span className="text-xs px-3 py-1 bg-accent-light text-accent rounded-lg">Saved</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              <BookOpen className="w-4 h-4 inline mr-1.5 text-primary" />
              Focus This Week
            </label>
            <textarea
              value={form.focus_this_week}
              onChange={(e) => setForm({ ...form, focus_this_week: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="What was your main focus this week?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                <Trophy className="w-4 h-4 inline mr-1.5 text-accent" />
                Main Wins
              </label>
              <textarea
                value={form.main_wins}
                onChange={(e) => setForm({ ...form, main_wins: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="What went well? Key achievements..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                <Wrench className="w-4 h-4 inline mr-1.5 text-text-muted" />
                Main Difficulties
              </label>
              <textarea
                value={form.main_difficulties}
                onChange={(e) => setForm({ ...form, main_difficulties: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="What was challenging? Blockers..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Hours Spent</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.hours_spent}
                onChange={(e) => setForm({ ...form, hours_spent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="e.g. 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Confidence Level</label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setForm({ ...form, confidence_level: level })}
                    className="transition-all"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        level <= form.confidence_level
                          ? 'text-primary fill-primary'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-medium text-text ml-2">{form.confidence_level}/5</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Next Week Plan</label>
            <textarea
              value={form.next_week_plan}
              onChange={(e) => setForm({ ...form, next_week_plan: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder="What's the plan for next week?"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              {existingReview && (
                <button
                  onClick={() => handleGenerateAi(existingReview.id)}
                  disabled={generatingAi}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 transition-colors"
                >
                  {generatingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {generatingAi ? 'Generating AI Coach...' : 'Generate AI Coaching'}
                </button>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : existingReview ? 'Update Review' : 'Save Review'}
            </button>
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="xl:col-span-1">
          <div className="bg-gradient-to-b from-indigo-50 to-surface dark:from-indigo-900/20 dark:to-surface rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
              <Bot className="w-6 h-6" />
              <h3 className="font-bold text-lg">AI Coach Feedback</h3>
            </div>
            
            {!existingReview ? (
             <div className="text-center p-6 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800">
               <p className="text-sm text-text-muted">Save your weekly review first mathematically to unlock AI insights.</p>
             </div>
            ) : existingReview.ai_feedback ? (
              <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-text">
                <ReactMarkdown>{existingReview.ai_feedback}</ReactMarkdown>
              </div>
            ) : generatingAi ? (
              <div className="flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-xl space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-indigo-600 dark:text-indigo-400 animate-pulse">DeepSeek is analyzing your progress...</p>
              </div>
            ) : (
              <div className="text-center p-6 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
                <p className="text-sm text-text-muted">Click <strong>Generate AI Coaching</strong> to get personalized formal feedback and study recommendations based on your performance this week.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

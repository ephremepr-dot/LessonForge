import { useState, useEffect, useCallback } from 'react';
import { BookOpen, History, Loader2, Printer } from 'lucide-react';
import { supabase, type LessonPlan } from '@/lib/supabase';
import { generateLessonPlan } from '@/lib/generateLessonPlan';
import StandardForm from '@/components/StandardForm';
import LessonPlanDisplay from '@/components/LessonPlanDisplay';
import SavedPlans from '@/components/SavedPlans';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [view, setView] = useState<'generator' | 'library'>('generator');

  const fetchSavedPlans = useCallback(async () => {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('lesson_plans')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Could not load saved lesson plans.');
    } else if (data) {
      setSavedPlans(data as LessonPlan[]);
    }
    setLoadingSaved(false);
  }, []);

  useEffect(() => {
    fetchSavedPlans();
  }, [fetchSavedPlans]);

  async function handleGenerate(standard: string, gradeLevel: string, duration: string) {
    setLoading(true);
    setError(null);
    setCurrentPlan(null);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const input = generateLessonPlan(standard, { gradeLevel, duration });
      const { data, error: insertError } = await supabase
        .from('lesson_plans')
        .insert(input)
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setCurrentPlan(data as LessonPlan);
      await fetchSavedPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while generating the lesson plan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('lesson_plans').delete().eq('id', id);
    if (error) {
      setError('Could not delete the lesson plan.');
      return;
    }
    if (currentPlan?.id === id) setCurrentPlan(null);
    await fetchSavedPlans();
  }

  function handleSelect(plan: LessonPlan) {
    setCurrentPlan(plan);
    setView('generator');
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">LessonForge</h1>
              <p className="text-xs text-slate-500 mt-0.5">Standards to lesson plans in seconds</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('generator')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition ${
                view === 'generator' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="hidden sm:inline">Generator</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              onClick={() => setView('library')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition ${
                view === 'library' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">My Plans</span>
                {savedPlans.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-teal-100 text-teal-700">
                    {savedPlans.length}
                  </span>
                )}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 print:hidden">
            {error}
          </div>
        )}

        {view === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StandardForm onGenerate={handleGenerate} loading={loading} />
              {savedPlans.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-5 print:hidden">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" />
                    Recent Plans
                  </h3>
                  <SavedPlans
                    plans={savedPlans.slice(0, 4)}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-3">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
                  <p className="text-sm font-medium text-slate-600">Building your lesson plan...</p>
                  <p className="text-xs text-slate-400 mt-1">Analyzing the standard and generating objectives, materials, and procedure.</p>
                </div>
              )}
              {!loading && currentPlan && (
                <div className="space-y-4">
                  <div className="flex justify-end print:hidden">
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <Printer className="w-4 h-4" />
                      Print / Save PDF
                    </button>
                  </div>
                  <LessonPlanDisplay plan={currentPlan} />
                </div>
              )}
              {!loading && !currentPlan && (
                <div className="hidden lg:flex flex-col items-center justify-center py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-500 mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">Your lesson plan will appear here</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-xs">
                    Enter a curriculum standard on the left and click Generate to build a complete, ready-to-teach lesson plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Lesson Plans</h2>
              <p className="text-sm text-slate-500 mt-1">All your generated lesson plans, saved automatically.</p>
            </div>
            {loadingSaved ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              </div>
            ) : (
              <SavedPlans plans={savedPlans} onSelect={handleSelect} onDelete={handleDelete} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-slate-400">LessonForge — Turn any curriculum standard into a complete lesson plan.</p>
        </div>
      </footer>
    </div>
  );
}

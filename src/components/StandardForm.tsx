import { useState, FormEvent } from 'react';
import { Sparkles, Loader2, BookOpen, Clock, GraduationCap } from 'lucide-react';

interface StandardFormProps {
  onGenerate: (standard: string, gradeLevel: string, duration: string) => void;
  loading: boolean;
}

const GRADE_OPTIONS = [
  'Auto-detect',
  'Pre-K',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Elementary',
  'Middle School',
  'High School',
];

const DURATION_OPTIONS = ['30 minutes', '45 minutes', '60 minutes', '90 minutes', 'Full day'];

const EXAMPLE_STANDARDS = [
  'CCSS.MATH.CONTENT.6.RP.A.1 — Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
  'NGSS MS-LS1-1 — Conduct an investigation to provide evidence that living things are made of cells; either one cell or many different numbers and types of cells.',
  'CCSS.ELA-LITERACY.RL.4.3 — Describe in depth a character, setting, or event in a story or drama, drawing on specific details in the text.',
];

export default function StandardForm({ onGenerate, loading }: StandardFormProps) {
  const [standard, setStandard] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Auto-detect');
  const [duration, setDuration] = useState('45 minutes');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!standard.trim() || loading) return;
    onGenerate(
      standard.trim(),
      gradeLevel === 'Auto-detect' ? '' : gradeLevel,
      duration
    );
  }

  function useExample(ex: string) {
    setStandard(ex);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Enter a Curriculum Standard</h2>
      </div>
      <p className="text-sm text-slate-500 mb-5 ml-13">
        Paste any curriculum standard — Common Core, NGSS, TEKS, or your own. We'll build a complete lesson plan instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="standard" className="block text-sm font-medium text-slate-700 mb-1.5">
            Curriculum Standard
          </label>
          <textarea
            id="standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            rows={3}
            placeholder="e.g. CCSS.MATH.CONTENT.6.RP.A.1 — Understand the concept of a ratio..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none resize-none"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLE_STANDARDS.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => useExample(ex)}
                className="text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-full px-3 py-1 transition"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Grade Level
              </span>
            </label>
            <select
              id="grade"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 bg-white shadow-sm transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Lesson Duration
              </span>
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 bg-white shadow-sm transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!standard.trim() || loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Lesson Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Lesson Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
}

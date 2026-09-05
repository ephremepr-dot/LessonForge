import { Trash2, FileText, Clock, GraduationCap } from 'lucide-react';
import type { LessonPlan } from '@/lib/supabase';

interface SavedPlansProps {
  plans: LessonPlan[];
  onSelect: (plan: LessonPlan) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SavedPlans({ plans, onSelect, onDelete }: SavedPlansProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-500">No saved lesson plans yet. Generate one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {plans.map((plan) => (
        <li key={plan.id}>
          <div className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-sm">
            <button
              onClick={() => onSelect(plan)}
              className="flex-1 text-left min-w-0"
            >
              <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition">
                {plan.title}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{plan.standard}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <GraduationCap className="w-3 h-3" />
                  {plan.grade_level}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {plan.duration}
                </span>
                <span className="text-xs text-slate-400">{formatDate(plan.created_at)}</span>
              </div>
            </button>
            <button
              onClick={() => onDelete(plan.id)}
              className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              aria-label="Delete lesson plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

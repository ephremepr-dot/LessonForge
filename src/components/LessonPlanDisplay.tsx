import { Target, Package, ListChecks, ClipboardCheck, Users, Home, Clock } from 'lucide-react';
import type { LessonPlan } from '@/lib/supabase';

interface LessonPlanDisplayProps {
  plan: LessonPlan;
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-teal-600">{icon}</span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    </div>
  );
}

export default function LessonPlanDisplay({ plan }: LessonPlanDisplayProps) {
  const totalMin = plan.duration;

  return (
    <article className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-emerald-600 px-6 py-7 sm:px-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {plan.subject}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {plan.grade_level}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {totalMin}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{plan.title}</h2>
        <p className="mt-2 text-sm text-teal-50/90 leading-relaxed">{plan.standard}</p>
      </header>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Objectives */}
        <section>
          <SectionHeader icon={<Target className="w-4 h-4" />} title="Learning Objectives" />
          <ul className="space-y-2">
            {plan.objectives.map((obj, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Materials */}
        <section>
          <SectionHeader icon={<Package className="w-4 h-4" />} title="Materials Needed" />
          <div className="flex flex-wrap gap-2">
            {plan.materials.map((mat, i) => (
              <span key={i} className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
                {mat}
              </span>
            ))}
          </div>
        </section>

        {/* Procedure */}
        <section>
          <SectionHeader icon={<ListChecks className="w-4 h-4" />} title="Lesson Procedure" />
          <ol className="relative border-l-2 border-teal-100 ml-2 space-y-5">
            {plan.procedure.map((step, i) => (
              <li key={i} className="ml-6 relative">
                <span className="absolute -left-[31px] flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-semibold ring-4 ring-white">
                  {i + 1}
                </span>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{step.phase}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{step.duration}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Assessment */}
        <section>
          <SectionHeader icon={<ClipboardCheck className="w-4 h-4" />} title="Assessment" />
          <p className="text-sm text-slate-700 leading-relaxed">{plan.assessment}</p>
        </section>

        {/* Differentiation */}
        <section>
          <SectionHeader icon={<Users className="w-4 h-4" />} title="Differentiation" />
          <p className="text-sm text-slate-700 leading-relaxed">{plan.differentiation}</p>
        </section>

        {/* Homework */}
        <section>
          <SectionHeader icon={<Home className="w-4 h-4" />} title="Homework / Extension" />
          <p className="text-sm text-slate-700 leading-relaxed">{plan.homework}</p>
        </section>
      </div>
    </article>
  );
}

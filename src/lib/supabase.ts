import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProcedureStep {
  phase: string;
  title: string;
  detail: string;
  duration: string;
}

export interface LessonPlan {
  id: string;
  standard: string;
  subject: string;
  grade_level: string;
  duration: string;
  title: string;
  objectives: string[];
  materials: string[];
  procedure: ProcedureStep[];
  assessment: string;
  differentiation: string;
  homework: string;
  created_at: string;
}

export type LessonPlanInput = Omit<LessonPlan, 'id' | 'created_at'>;

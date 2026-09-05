/*
# Create lesson_plans table (single-tenant, no auth)

1. New Tables
- `lesson_plans`
  - `id` (uuid, primary key)
  - `standard` (text, the curriculum standard the teacher entered)
  - `subject` (text, detected/entered subject area)
  - `grade_level` (text, target grade level)
  - `duration` (text, estimated lesson duration)
  - `title` (text, generated lesson title)
  - `objectives` (text[], learning objectives)
  - `materials` (text[], required materials)
  - `procedure` (jsonb, structured lesson steps)
  - `assessment` (text, assessment strategy)
  - `differentiation` (text, differentiation strategies)
  - `homework` (text, homework/extension)
  - `created_at` (timestamp)
2. Security
- Enable RLS on `lesson_plans`.
- Allow anon + authenticated CRUD because the app has no sign-in (intentionally shared/public data).
*/

CREATE TABLE IF NOT EXISTS lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  grade_level text NOT NULL DEFAULT 'General',
  duration text NOT NULL DEFAULT '45 minutes',
  title text NOT NULL,
  objectives text[] NOT NULL DEFAULT '{}',
  materials text[] NOT NULL DEFAULT '{}',
  procedure jsonb NOT NULL DEFAULT '[]',
  assessment text NOT NULL DEFAULT '',
  differentiation text NOT NULL DEFAULT '',
  homework text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lesson_plans" ON lesson_plans;
CREATE POLICY "anon_select_lesson_plans" ON lesson_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lesson_plans" ON lesson_plans;
CREATE POLICY "anon_insert_lesson_plans" ON lesson_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lesson_plans" ON lesson_plans;
CREATE POLICY "anon_update_lesson_plans" ON lesson_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lesson_plans" ON lesson_plans;
CREATE POLICY "anon_delete_lesson_plans" ON lesson_plans FOR DELETE
  TO anon, authenticated USING (true);

// ============ Models ============

export interface User {
  id: string;
  name: string;
  email: string;
  theme: 'light' | 'dark' | 'dimmed';
  language: string;
}

export interface Task {
  id: string;
  user_id: string;
  week_number: number;
  category: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  estimated_hours: number | null;
  checkbox_completed: boolean;
  status: TaskStatus;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  submission_required: boolean;
  answer_summary: string | null;
  notes: string | null;
  blockers: string | null;
  submissions?: Submission[];
  submissions_count?: number;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'done' | 'blocked';

export interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  submission_type: SubmissionType;
  title: string;
  url: string | null;
  file_path: string | null;
  file_url: string | null;
  original_file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  submitted_at: string | null;
  reviewed: boolean;
  score: number | null;
  feedback: string | null;
  reflection: string | null;
  next_fix: string | null;
  created_at: string;
  updated_at: string;
}

export type SubmissionType = 'link' | 'pdf' | 'word' | 'image' | 'notebook' | 'zip' | 'other';

export interface WeeklyReview {
  id: string;
  user_id: string;
  week_number: number;
  focus_this_week: string | null;
  main_wins: string | null;
  main_difficulties: string | null;
  hours_spent: number | null;
  confidence_level: number | null;
  next_week_plan: string | null;
  ai_feedback?: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Dashboard ============

export interface WeekProgress {
  week: number;
  total: number;
  completed: number;
  progress: number;
}

export interface DashboardData {
  total_tasks: number;
  completed_tasks: number;
  blocked_tasks: number;
  in_progress_tasks: number;
  not_started_tasks: number;
  overall_progress: number;
  current_week: number;
  current_week_progress: number;
  total_submissions: number;
  total_estimated_hours: number;
  high_priority_count: number;
  submission_required_count: number;
  submissions_done_count: number;
  weekly_progress: WeekProgress[];
  incomplete_tasks: Pick<Task, 'id' | 'title' | 'week_number' | 'status' | 'priority' | 'due_date'>[];
  recent_submissions: Pick<Submission, 'id' | 'task_id' | 'title' | 'submission_type' | 'submitted_at' | 'reviewed'>[];
}

// ============ Filters ============

export interface TaskFilters {
  week?: string;
  category?: string;
  status?: string;
  priority?: string;
  search?: string;
}

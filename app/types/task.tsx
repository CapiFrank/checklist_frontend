export interface Task {
  id?: string | null;
  title: string;
  note: string;
  date: Date | null | string;
  is_important: boolean | null;
  is_my_day: boolean | null;
  is_scheduled: boolean | null;
  page_id?: string | null;
}

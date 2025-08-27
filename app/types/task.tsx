export interface Task {
  id: string;
  title: string;
  note: string;
  date: Date | null;
  isImportant: boolean;
  isMyDay: boolean;
  isScheduled: boolean;
}

export interface Page {
  id?: string | null;
  title: string;
  children?: Page[];
  parent_id?: string | null;
}

export interface Project {
  id: string;
  name: string;
  totalHours: number;
  color: string;
}

export interface DayAllocation {
  date: string; // ISO format
  projectId: string;
}
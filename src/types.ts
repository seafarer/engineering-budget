export interface Project {
  id: string;
  name: string;
  totalHours: number;
  color: string;
}

export interface DayAllocation {
  date: string;
  projectIds: string[];  // Changed from projectId to projectIds array
}
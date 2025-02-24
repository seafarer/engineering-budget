import React from 'react';
import { Project, DayAllocation } from '../types';

interface CalendarProps {
  month: Date;
  allocations: DayAllocation[];
  projects: Project[];
  selectedProject: Project | null;
  onDayClick: (date: Date) => void;
  onRemoveAllocation: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ month, allocations, projects, selectedProject, onDayClick, onRemoveAllocation }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);
  
  const days = [];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Add weekday headers
  for (let i = 0; i < 7; i++) {
    days.push(
      <div key={`header-${i}`} className="text-center font-semibold p-2 border-b border-gray-200 bg-gray-50">
        {weekdays[i]}
      </div>
    );
  }
  
  // Add blank spaces for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 bg-gray-50 border border-gray-200"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    const allocation = allocations.find(a => a.date === dateStr);
    const project = allocation ? projects.find(p => p.id === allocation.projectId) : null;
    
    days.push(
      <div 
        key={`day-${day}`} 
        onClick={() => onDayClick(date)}
        className={`p-2 min-h-24 border border-gray-200 hover:bg-gray-50 cursor-pointer group relative ${
          selectedProject ? 'border-l border-t border-l-sky-600 border-t-sky-600' : ''
        }`}
        style={{ 
          backgroundColor: project ? project.color + '20' : '', 
          borderLeft: project ? `3px solid ${project.color}` : '' 
        }}
      >
        <div className="flex justify-between">
          <span className="font-medium">{day}</span>
          {project && (
            <>
              <span className="text-xs p-1 rounded" style={{ backgroundColor: project.color + '30' }}>
                {project.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAllocation(dateStr);
                }}
                className="absolute top-1 right-1 opacity-0 bg-white/50 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-600 transition-opacity rounded-full hover:bg-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-7 border border-gray-200 overflow-hidden shadow-sm">
      {days}
    </div>
  );
};

export default Calendar;
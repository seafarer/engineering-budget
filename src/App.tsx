import React, { useState, useEffect } from 'react';
import { Project, DayAllocation } from './types';
import Calendar from './components/Calendar';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [allocations, setAllocations] = useState<DayAllocation[]>(() => {
    const saved = localStorage.getItem('allocations');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('allocations', JSON.stringify(allocations));
  }, [allocations]);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleDayClick = (date: Date) => {
    if (!selectedProject) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if day already has an allocation
    const existingIndex = allocations.findIndex(a => a.date === dateStr);
    
    if (existingIndex >= 0) {
      // Remove allocation if clicking on the same project
      if (allocations[existingIndex].projectId === selectedProject.id) {
        setAllocations(allocations.filter((_, i) => i !== existingIndex));
      } else {
        // Replace with new project
        const newAllocations = [...allocations];
        newAllocations[existingIndex] = { date: dateStr, projectId: selectedProject.id };
        setAllocations(newAllocations);
      }
    } else {
      // Add new allocation
      setAllocations([...allocations, { date: dateStr, projectId: selectedProject.id }]);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getProjectUsage = (projectId: string) => {
    const allocationsCount = allocations.filter(a => a.projectId === projectId).length;
    return allocationsCount * 6; // 6 hours per day
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Engineering Time Budget</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              &lt; Prev
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Next &gt;
            </button>
          </div>
          
          <Calendar 
            month={currentMonth} 
            allocations={allocations} 
            projects={projects}
            selectedProject={selectedProject}
            onDayClick={handleDayClick}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <ProjectForm onAddProject={addProject} />
          
          <div className="mt-4">
            <ProjectList 
              projects={projects} 
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              calculateHoursUsed={getProjectUsage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
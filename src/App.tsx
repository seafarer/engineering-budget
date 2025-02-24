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
    if (!saved) return [];
    
    // Migrate old format to new format
    const parsed = JSON.parse(saved);
    if (parsed.length > 0 && 'projectId' in parsed[0]) {
      interface OldAllocation {
        date: string;
        projectId: string;
      }
      return parsed.map((a: OldAllocation) => ({
        date: a.date,
        projectIds: [a.projectId]
      }));
    }
    return parsed;
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
    const existing = allocations.find(a => a.date === dateStr);
    
    if (existing) {
      if (existing.projectIds.includes(selectedProject.id)) {
        // Remove this project
        setAllocations(allocations.map(a => 
          a.date === dateStr 
            ? { ...a, projectIds: a.projectIds.filter(id => id !== selectedProject.id) }
            : a
        ).filter(a => a.projectIds.length > 0));
      } else if (existing.projectIds.length < 2) {
        // Add as second project
        setAllocations(allocations.map(a => 
          a.date === dateStr 
            ? { ...a, projectIds: [...a.projectIds, selectedProject.id] }
            : a
        ));
      }
      // If already has 2 projects, do nothing
    } else {
      // Add new allocation
      setAllocations([...allocations, { date: dateStr, projectIds: [selectedProject.id] }]);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getProjectUsage = (projectId: string) => {
    return allocations.reduce((total, alloc) => {
      if (alloc.projectIds.includes(projectId)) {
        return total + (alloc.projectIds.length === 1 ? 6 : 3);
      }
      return total;
    }, 0);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setAllocations(allocations
      .map(a => ({
        ...a,
        projectIds: a.projectIds.filter(id => id !== projectId)
      }))
      .filter(a => a.projectIds.length > 0)
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const removeAllocation = (date: string, projectId: string) => {
    setAllocations(allocations
      .map(a => 
        a.date === date 
          ? { ...a, projectIds: a.projectIds.filter(id => id !== projectId) }
          : a
      )
      .filter(a => a.projectIds.length > 0)
    );
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
            onRemoveAllocation={removeAllocation}
          />
          <p className="text-sm text-gray-600 mt-3">
            You can add up to two projects per day. One project counts as 6 hours, if two are added they are 3 hours each.
          </p>
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
              onDeleteProject={deleteProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
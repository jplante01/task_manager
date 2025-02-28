import { useState } from 'react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  starred: boolean;
  created_at: string;
}

interface UseTaskManagerReturn {
  tasks: Task[];
  isLoadingTasks: boolean;
  error: string | null;
  newTaskDescription: string;
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (description: string) => void;
  addTask: (description: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskStar: (id: string) => void;
}

export function useTaskManager(): UseTaskManagerReturn {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      description: 'Complete project mockup',
      completed: false,
      starred: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      description: 'Review design with team',
      completed: true,
      starred: false,
      created_at: new Date().toISOString(),
    },
  ]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = (description: string) => {
    try {
      addTask(description);
      setNewTaskDescription('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const addTask = (description: string) => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        description: description.trim(),
        completed: false,
        starred: false,
        created_at: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    try {
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = (id: string) => {
    try {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const toggleTaskCompletion = (id: string) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
      );
    } catch (err) {
      setError('Failed to toggle task completion');
    }
  };

  const toggleTaskStar = (id: string) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, starred: !task.starred } : task)),
      );
    } catch (err) {
      setError('Failed to toggle task star');
    }
  };

  return {
    tasks,
    isLoadingTasks,
    error,
    newTaskDescription,
    setNewTaskDescription,
    handleAddTask,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    toggleTaskStar,
  };
}

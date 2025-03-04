import { useState, useEffect } from 'react';
import { taskService, Task } from '../services/taskService';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface UseTaskManagerReturn {
  tasks: Task[];
  isLoadingTasks: boolean;
  error: string | null;
  newTaskDescription: string;
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (description: string) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskStar: (id: string) => void;
}

export function useTaskManager(): UseTaskManagerReturn {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useTaskManager must be used within AuthProvider');
  const { user } = context;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on hook initialization
  useEffect(() => {
    loadTasks();
  }, []);

  // Fetch all tasks
  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleAddTask = (description: string) => {
    try {
      addTask(description);
      setNewTaskDescription('');
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    }
  };

  // Add a new task
  const addTask = async (description: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    try {
      const newTask = await taskService.createTask(description, user.id);
      setTasks([newTask, ...tasks]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  };

  // Toggle task completion status
  const toggleComplete = async (id: string) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      if (!taskToUpdate) return;

      const updatedTask = await taskService.updateTask(id, {
        completed: !taskToUpdate.completed,
      });

      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Toggle star status
  const toggleStar = async (id: string) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      if (!taskToUpdate) return;

      const updatedTask = await taskService.updateTask(id, {
        starred: !taskToUpdate.starred,
      });

      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  return {
    tasks,
    isLoadingTasks,
    error,
    newTaskDescription,
    setNewTaskDescription,
    handleAddTask,
    deleteTask,
    toggleTaskCompletion: toggleComplete,
    toggleTaskStar: toggleStar,
  };
}

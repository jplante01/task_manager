// pages/TaskList.tsx
import { useState } from 'react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  starred: boolean;
  created_at: string;
}

export const TaskList = () => {
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(), // This will be handled by Supabase later
      description: newTaskDescription.trim(),
      completed: false,
      starred: false,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskDescription('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const handleToggleStar = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, starred: !task.starred } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by starred first, then by completion status
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        <div className='text-sm text-gray-500'>
          {tasks.filter((t) => !t.completed).length} tasks remaining
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className='mb-6 flex gap-2'>
        <input
          type='text'
          placeholder='Add a new task...'
          className='flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
          disabled={!newTaskDescription.trim()}
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className='text-center text-gray-500 py-8'>No tasks yet. Add one above!</div>
      ) : (
        <div className='space-y-2'>
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors ${
                task.completed ? 'bg-gray-50' : ''
              }`}
            >
              {/* Checkbox */}
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                className='h-5 w-5 rounded border-gray-300 focus:ring-blue-500'
              />

              {/* Task Description */}
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.description}
              </span>

              {/* Star Button */}
              <button
                onClick={() => handleToggleStar(task.id)}
                className={`p-1 hover:bg-gray-100 rounded ${
                  task.starred ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                ★
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className='p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Task Summary */}
      <div className='mt-6 text-sm text-gray-500'>
        <div>Total: {tasks.length} tasks</div>
        <div>Completed: {tasks.filter((t) => t.completed).length} tasks</div>
        <div>Starred: {tasks.filter((t) => t.starred).length} tasks</div>
      </div>
    </div>
  );
};

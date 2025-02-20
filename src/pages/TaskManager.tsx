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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const activeTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <div className='max-w-2xl mx-auto p-4'>
      {/* Header with Hamburger */}
      <div className='flex justify-between items-center mb-6'>
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Menu'
        >
          <svg
            className='w-6 h-6 text-gray-700'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>

      {/* Overlay when drawer is open */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-20 ${
          isDrawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-4'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-bold'>My Tasks</h1>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className='p-2 hover:bg-gray-100 rounded-full'
            >
              ×
            </button>
          </div>
          {/* Task Summary moved to drawer */}
          <div className='space-y-2 text-sm text-gray-500'>
            <div>Total: {tasks.length} tasks</div>
            <div>Completed: {tasks.filter((t) => t.completed).length} tasks</div>
            <div>Starred: {tasks.filter((t) => t.starred).length} tasks</div>
          </div>
        </div>
      </div>

      {/* Move button outside main content and make it sticky */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className='fixed bottom-8 right-8 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg text-2xl'
      >
        {isFormVisible ? '×' : '+'}
      </button>

      {/* Add Task Form */}
      {isFormVisible && (
        <form onSubmit={handleAddTask} className='mb-6 flex gap-2'>
          <input
            type='text'
            placeholder='Add a new task...'
            className='flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            autoFocus
          />
          <button
            type='submit'
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'
            disabled={!newTaskDescription.trim()}
          >
            Add Task
          </button>
        </form>
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className='text-center text-gray-500 py-8'>No tasks yet. Add one above!</div>
      ) : (
        <div className='space-y-4'>
          {/* Active Tasks */}
          <div className='space-y-2'>
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors`}
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

          {/* Divider and Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <div className='flex items-center gap-2 pt-4'>
                <div className='flex-1 h-px bg-gray-200'></div>
                <span className='text-sm text-gray-500'>Completed</span>
                <div className='flex-1 h-px bg-gray-200'></div>
              </div>

              <div className='space-y-2'>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className='flex items-center gap-3 p-3 border rounded bg-gray-50 hover:bg-gray-100 transition-colors'
                  >
                    {/* Checkbox */}
                    <input
                      type='checkbox'
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className='h-5 w-5 rounded border-gray-300 focus:ring-blue-500'
                    />

                    {/* Task Description */}
                    <span
                      className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
                    >
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

// pages/TaskList.tsx
import { useState, useContext } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import { AddTaskForm } from '../components/AddTaskForm';
import { TaskItem } from '../components/TaskItem';
import { AuthContext } from '../contexts/AuthContext';

export const TaskList = () => {
  const {
    tasks,
    isLoadingTasks,
    error,
    newTaskDescription,
    setNewTaskDescription,
    handleAddTask,
    deleteTask,
    toggleTaskCompletion,
    toggleTaskStar,
  } = useTaskManager();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('TaskList must be used within an AuthProvider');
  }

  const { signOut } = context;

  const onAddTask = (description: string) => {
    handleAddTask(description);
    setIsDrawerOpen(false);
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

  if (isLoadingTasks) {
    return <div className='text-center py-8'>Loading tasks...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-500'>{error}</div>;
  }

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar for desktop / Drawer for mobile */}
      <div
        className={`
          fixed lg:sticky lg:flex
          top-0 h-screen w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out z-30
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:mr-8
        `}
      >
        <div className='p-4 w-full h-full flex flex-col'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-bold'>My Tasks</h1>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className='p-2 hover:bg-gray-100 rounded-full lg:hidden'
            >
              ×
            </button>
          </div>

          {/* Replace form with AddTaskForm component */}
          <div className='mb-6'>
            <AddTaskForm
              description={newTaskDescription}
              onDescriptionChange={setNewTaskDescription}
              onSubmit={onAddTask}
            />
          </div>

          {/* Task Summary */}
          <div className='space-y-2 text-sm text-gray-500 mt-auto'>
            <div>Total: {tasks.length} tasks</div>
            <div>Completed: {tasks.filter((t) => t.completed).length} tasks</div>
            <div>Starred: {tasks.filter((t) => t.starred).length} tasks</div>

            {/* Sign Out Button */}
            <button
              onClick={signOut}
              className='w-full mt-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors'
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 p-4 lg:pl-0'>
        {/* Mobile-only header */}
        <div className='flex justify-between items-center mb-6 lg:hidden'>
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

        {/* Task List with added top spacing on desktop */}
        <div className='lg:pt-16'>
          {sortedTasks.length === 0 ? (
            <div className='text-center text-gray-500 py-8'>No tasks yet. Add one above!</div>
          ) : (
            <div className='space-y-4'>
              {/* Active Tasks */}
              <div className='space-y-2'>
                {activeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    onToggleComplete={toggleTaskCompletion}
                    onToggleStar={toggleTaskStar}
                    onDelete={deleteTask}
                  />
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
                      <TaskItem
                        key={task.id}
                        {...task}
                        onToggleComplete={toggleTaskCompletion}
                        onToggleStar={toggleTaskStar}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-20 lg:hidden ${
          isDrawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Mobile-only floating action button - Updated to open sidebar */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className='fixed bottom-8 right-8 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg text-2xl lg:hidden'
      >
        +
      </button>
    </div>
  );
};

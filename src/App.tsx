import { TaskList } from './pages/TaskManager';

function App() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col  sm:py-12'>
      <div className='relative sm:max-w-xl sm:mx-auto'>
        <TaskList />
      </div>
    </div>
  );
}

export default App;

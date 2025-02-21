interface AddTaskFormProps {
  onSubmit: (description: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const AddTaskForm = ({ onSubmit, description, onDescriptionChange }: AddTaskFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit(description);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <input
        type='text'
        placeholder='Add a new task...'
        className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <button
        type='submit'
        className='w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'
        disabled={!description.trim()}
      >
        Add Task
      </button>
    </form>
  );
};

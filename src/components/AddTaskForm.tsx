import { FormEvent } from 'react';

interface AddTaskFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: (description: string) => void;
  isLoading?: boolean;
}

export const AddTaskForm = ({
  description,
  onDescriptionChange,
  onSubmit,
  isLoading = false,
}: AddTaskFormProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit(description.trim());
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <input
        type='text'
        placeholder='Add a new task...'
        className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={isLoading}
      />
      <button
        type='submit'
        className='w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50'
        disabled={!description.trim() || isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

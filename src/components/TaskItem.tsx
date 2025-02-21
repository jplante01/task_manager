interface TaskItemProps {
  id: string;
  description: string;
  completed: boolean;
  starred: boolean;
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({
  id,
  description,
  completed,
  starred,
  onToggleComplete,
  onToggleStar,
  onDelete,
}: TaskItemProps) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors ${
        completed ? 'bg-gray-50' : ''
      }`}
    >
      {/* Checkbox */}
      <input
        type='checkbox'
        checked={completed}
        onChange={() => onToggleComplete(id)}
        className='h-5 w-5 rounded border-gray-300 focus:ring-blue-500'
      />

      {/* Task Description */}
      <span className={`flex-1 ${completed ? 'line-through text-gray-500' : ''}`}>
        {description}
      </span>

      {/* Star Button */}
      <button
        onClick={() => onToggleStar(id)}
        className={`p-1 hover:bg-gray-100 rounded ${
          starred ? 'text-yellow-500' : 'text-gray-400'
        }`}
      >
        ★
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(id)}
        className='p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded'
      >
        ×
      </button>
    </div>
  );
}; 
import { useState, useEffect } from 'react'
import { FaEdit, FaTrash } from "react-icons/fa";


function ToDoList() {
  const [Task, setTask] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState("");
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [editingId, setEditingId] = useState(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(Task));
  }, [Task]);

  const showAlert = (msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(''), 2200);
  };

  const addTask = () => {
    if (!input.trim()) return;

    if (editingId) {
      // Update existing task
      setTask(Task.map(task =>
        task.id === editingId ? { ...task, text: input } : task
      ));
      setEditingId(null);
      showAlert("Task updated!");
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        text: input,
        completed: false,
      };
      setTask([newTask, ...Task]);
      showAlert("Task added!");
    }

    setInput("");
  };

  const completeTask = (id) => {
    setTask(Task.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, text) => {
    setEditingId(id);
    setInput(text);
  };

  const removeTask = (id) => {
    setTask(Task.filter(task => task.id !== id));
    showAlert("Task deleted!");
  };

  // filter Tasks
  const filteredTasks = Task.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div>
      <nav className='flex justify-between bg-red-700 text-white py-2 px-6'>
        <h2 className='font-bold text-lg'>ToDoApp</h2>
        <ul className='flex gap-5'>
          <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
          <li className='cursor-pointer hover:font-bold transition-all'>MyTodos</li>
        </ul>
      </nav>

      {alert && (
        <div className="text-center bg-green-700 text-white font-bold py-2">{alert}</div>
      )}

      <main>
        <div className="container bg-red-200 mt-4 rounded-xl min-h-[80vh] p-6">
          <div className="add flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter Task'
              className="flex-1 rounded-md px-3 py-2 outline"
            />
            <button
              type="button"
              className='bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-700'
              onClick={addTask}
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>

          <hr className="mb-4" />

          <div className="todos">
            <h4 className="font-bold mb-2">Your Todos</h4>

            {/* Filter Buttons */}
            <div className="mb-3 flex gap-3">
              <button
                className={`px-3 py-1 rounded-md border ${filter === 'all' ? 'bg-red-600 text-white' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded-md border ${filter === 'active' ? 'bg-red-600 text-white' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-1 rounded-md border ${filter === 'completed' ? 'bg-red-600 text-white' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            {/* Task List */}
            <ul className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <li key={task.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                        className="w-4 h-4"
                      />
                      <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.text}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className='bg-yellow-400 px-3 py-1 text-sm rounded-md hover:bg-yellow-600'
                        onClick={() => editTask(task.id, task.text)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className='bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700'
                        onClick={() => removeTask(task.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-600">No tasks available</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ToDoList

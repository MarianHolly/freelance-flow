import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/tasks/");
      setTasks(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async () => {
    if (!newTask.title) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/tasks/",
        newTask
      );
      setTasks([response.data, ...tasks]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Toggle task completion
  const toggleTask = async (tast: Task) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/tasks/${tast.id}/`,
        { completed: !tast.completed }
      );
      setTasks(tasks.map((t) => (t.id === tast.id ? response.data : t)));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/tasks/${taskId}/`
      );
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 flex flex-col items-center">
      <h1 className="text-center text-2xl text-gray-900 font-semibold mb-8">
        <span className="opacity-70">FreelanceFlow</span> - Task Manager
      </h1>

      {/* Add Task Form */}
      <div className="border border-gray-100 rounded-sm py-3 px-6 flex flex-col items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border border-gray-200 rounded-md p-2 mb-2 w-96"
        />

        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="border border-gray-200 rounded-md p-2 mb-2 w-96"
        />
        <button
          onClick={createTask}
          className="bg-gray-800 text-gray-100 border border-gray-100 rounded-md p-2"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-center text-xl text-gray-800 opacity-95 mt-6 font-semibold">
          Loading tasks...
        </p>
      ) : (
        <div>
          <h3 className="text-center text-xl text-gray-800 opacity-95 mt-6 font-light">
            Tasks <span className="font-semibold">({tasks.length})</span>
          </h3>
          <div className="flex flex-col justify-center items-center my-6 gap-1">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-600 italic mt-4">
                No tasks yet. Create your first task above!
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex justify-between items-center border border-gray-100 rounded-sm py-3 px-6 w-96 min-h-[70px] transition-colors duration-200 ease-in-out
                    ${task.completed ? "bg-gray-50" : "bg-white"}
                  `}
                >
                  <div className="flex-1 mr-4">
                    <h4
                      className={`text-lg font-normal mb-1
                      ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }
                    `}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <small className="text-xs text-gray-400 mt-1 block">
                      Created: {new Date(task.created_at).toLocaleString()}
                    </small>
                  </div>
                  <div className="flex flex-col space-y-1 ml-auto">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`text-xs py-1 px-2 rounded
                        ${
                          task.completed
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }
                          transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-gray-300
                      `}
                    >
                      {task.completed ? "Done" : "Mark Done"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs py-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

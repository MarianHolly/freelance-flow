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
        <p>Loading tasks...</p>
      ) : (
        <div>
          <h3>Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => <div key={task.id}>{task.title}</div>)
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;

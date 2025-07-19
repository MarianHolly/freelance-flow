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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add a new task</h2>
      <div>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
        />
        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button onClick={createTask}>Create</button>
      </div>

      <h1>Task List</h1>

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

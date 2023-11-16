import React, { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css"

const TaskForm = ({ addTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newTask === '' ){
      alert("please enter the task")
    }else{
      addTask(newTask);
      setNewTask('');
    }
 
  };

  return (
    <form className='form-main' onSubmit={handleSubmit}>
      <input
      className='form-input'
        type="text"
        placeholder="Add new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskList = ({ tasks, toggleTask, deleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input
          className='input-box'
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          {task.title}
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'TOGGLE_TASK':
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    case 'SET_TASKS':
      return action.payload;
    default:
      return state;
  }
};

const App = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/tasks');
        dispatch({ type: 'SET_TASKS', payload: response.data });
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };

    fetchData();
  }, []);

  const addTask = async (title) => {
    try {
      const response = await axios.post('http://localhost:3002/tasks', {
        title,
        completed: false,
      });
      dispatch({ type: 'ADD_TASK', payload: response.data });
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`http://localhost:3002/tasks/${id}`, {
        completed: !tasks.find((task) => task.id === id).completed,
      });
      dispatch({ type: 'TOGGLE_TASK', payload: id });
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  return (
    <div className='main'>
      <h1>Task Tracker</h1>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
};

export default App;

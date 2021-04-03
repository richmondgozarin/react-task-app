import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';

import './App.css';


function App() {
  const server = {
    url: 'http://localhost:5000'
  }
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const serverResponse = await fetchTasks();
      setTasks(serverResponse)

    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await fetch(`${server.url}/tasks`)
    const data = await response.json();
    return data;
  }

  const fetchTask = async (id) => {
    const response = await fetch(`${server.url}/tasks/${id}`)
    const data = await response.json();
    return data;
  }

  const addTask = async (task) => {
    const res = await fetch(`${server.url}/tasks`, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();


    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`${server.url}/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updateTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder
    }

    const res = await fetch(`${server.url}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) =>
      (task.id === id)
        ? { ...task, reminder: data.reminder }
        : task
    ))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Route path="/" exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length
              ? <Tasks tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder} />
              : 'Hooray! All cleared up!'}
          </>
        )} />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}


export default App;

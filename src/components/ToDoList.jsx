import React, { useState, useEffect } from 'react';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({});

  const API_KEY = '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'; // Replace with your actual API key
  const API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

  const predefinedTasks = [
    "Walk for 30 minutes",
    "Drink 8 glasses of water",
    "Read for 20 minutes",
    "Meditate for 10 minutes",
    "Stretch for 15 minutes",
    "Run for 20 minutes",
    "Do 10 push-ups",
    "Eat a healthy breakfast",
    "Take a 5-minute break every hour",
    "Plan your day",
    "Write down 3 things you're grateful for",
    "Do 20 squats",
    "Avoid processed foods today",
    "Cook a meal at home",
    "Call a friend or family member",
    "Go to bed early",
    "Take a 30-minute walk after lunch",
    "Drink a green smoothie",
    "Spend 15 minutes learning something new",
    "Declutter your workspace",
    "Listen to a podcast or audiobook",
    "Practice deep breathing exercises",
    "Avoid sugar for one day",
    "Do a 10-minute yoga session",
    "Limit screen time before bed",
    "Complete a quick home workout",
    "Drink water before every meal",
    "Write down your goals for the week",
    "Spend 30 minutes on a hobby",
    "Reflect on your day before going to bed"
  ];

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      const initialTasks = predefinedTasks.slice(0, 30).map((content, index) => ({
        id: Date.now() + index,
        content,
        completed: false,
        dueDate: new Date(Date.now() + index * 86400000).toISOString().split('T')[0], // Schedule tasks over 30 days
      }));
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const generateSuggestionsAPI = async (taskContent) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.2-11b-text-preview',
          messages: [
            {
              role: 'user',
              content: `Generate up to 5 benefits of completing the task: "${taskContent}".`,
            },
          ],
          max_tokens: 1024,
          temperature: 1,
          top_p: 1,
        }),
      });

      const data = await response.json();
      const suggestion = data.choices[0].message.content;

      return suggestion;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return 'Error generating suggestions';
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    if (!task) return;

    const newTask = {
      id: Date.now(),
      content: task,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    };

    setTasks([...tasks, newTask]);
    setTask('');
  };

  const handleToggleComplete = async (id) => {
    const updatedTasks = tasks.map(async (t) => {
      if (t.id === id) {
        const updatedTask = { ...t, completed: !t.completed };

        if (!t.completed) {
          const suggestion = await generateSuggestionsAPI(t.content);
          setSuggestions((prev) => ({ ...prev, [t.id]: suggestion }));
        } else {
          setSuggestions((prev) => {
            const updatedSuggestions = { ...prev };
            delete updatedSuggestions[t.id];
            return updatedSuggestions;
          });
        }
        return updatedTask;
      }
      return t;
    });

    setTasks(await Promise.all(updatedTasks));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setSuggestions((prev) => {
      const updatedSuggestions = { ...prev };
      delete updatedSuggestions[id];
      return updatedSuggestions;
    });
  };

  const handlePredefinedTaskClick = (taskContent) => {
    const newTask = {
      id: Date.now(),
      content: taskContent,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="p-6 bg-gray-200 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600">30-Day To-Do List</h2>
      <div className="flex mb-6 justify-center">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="p-2 border rounded w-3/4 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Add a new task"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 bg-yellow-500 text-white py-2 px-4 rounded shadow-md hover:bg-yellow-600 transition duration-200"
        >
          Add Task
        </button>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Predefined Tasks</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {predefinedTasks.map((predefinedTask, index) => (
          <button
            key={index}
            onClick={() => handlePredefinedTaskClick(predefinedTask)}
            className="bg-yellow-300 text-black py-2 px-4 rounded shadow-md hover:bg-yellow-400 transition duration-200"
          >
            {predefinedTask}
          </button>
        ))}
      </div>
      
      <ul className="list-none pl-0">
        {tasks.map((task) => (
          <li key={task.id} className="flex flex-col mb-4 bg-white p-4 rounded-lg shadow-sm transition-transform duration-200 hover:shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="mr-2"
                />
                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                  {task.content} <span className="text-sm">(Due: {task.dueDate})</span>
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="ml-4 text-red-500 hover:text-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
            {suggestions[task.id] && (
              <div className="mt-2 p-2 bg-green-100 rounded-md">
                <h4 className="text-green-800 font-semibold">Benefits:</h4>
                <ul className="list-disc pl-6">
                  {suggestions[task.id]
                    .split('\n')
                    .filter((benefit) => benefit)
                    .slice(0, 10) // Limit to 10 benefits
                    .map((benefit, index) => (
                      <li key={index} className="text-green-700">
                        {benefit}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      {loading && <p className="mt-4 text-center text-yellow-600">Generating benefits...</p>}
    </div>
  );
};

export default ToDoList;

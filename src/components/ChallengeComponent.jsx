import React, { useState } from 'react';

// Your API function for generating the plan
const generatePlanAPI = async (goal, age, height, weight, healthIssues) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`, // Replace with your API key
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: `Generate a ${goal} 30-day plan for a ${age} years old person who is ${height} cm tall, weighs ${weight} kg, and has the following health issues: ${healthIssues.join(', ')}.` },
      ],
      model: "llama-3.2-11b-text-preview",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false, // Set to false for direct response
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch the plan');
  }
  const data = await response.json();
  return data.choices[0].message.content;
};

const ChallengeComponent = () => {
  const [goal, setGoal] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [healthIssues, setHealthIssues] = useState([]);
  const [newHealthIssue, setNewHealthIssue] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    if (!goal || !age || !height || !weight) return;

    setLoading(true);
    setError('');
    try {
      const generatedPlan = await generatePlanAPI(goal, age, height, weight, healthIssues);
      setPlan(generatedPlan);
    } catch (err) {
      setError('Error generating the plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHealthIssue = () => {
    if (newHealthIssue) {
      setHealthIssues([...healthIssues, newHealthIssue]);
      setNewHealthIssue('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Choose Your Goal</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`py-2 px-4 rounded ${goal === 'gain' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setGoal('gain')}
        >
          Gain Weight
        </button>
        <button
          className={`py-2 px-4 rounded ${goal === 'lose' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setGoal('lose')}
        >
          Lose Weight
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Age:</label>
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          className="p-2 border rounded w-full" 
          placeholder="Enter your age"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Height (cm):</label>
        <input 
          type="number" 
          value={height} 
          onChange={(e) => setHeight(e.target.value)} 
          className="p-2 border rounded w-full" 
          placeholder="Enter your height"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Weight (kg):</label>
        <input 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          className="p-2 border rounded w-full" 
          placeholder="Enter your weight"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Health Issues:</label>
        <input 
          type="text" 
          value={newHealthIssue} 
          onChange={(e) => setNewHealthIssue(e.target.value)} 
          className="p-2 border rounded w-full" 
          placeholder="Add a health issue (e.g., diabetes)"
        />
        <button 
          onClick={handleAddHealthIssue} 
          className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
        >
          Add Health Issue
        </button>
        <div className="mt-2">
          {healthIssues.map((issue, index) => (
            <span key={index} className="inline-block bg-gray-300 mr-2 rounded px-2 py-1">{issue}</span>
          ))}
        </div>
      </div>
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded"
        onClick={generatePlan}
        disabled={!goal || !age || !height || !weight || loading}
      >
        {loading ? 'Generating...' : 'Generate 30-Day Plan'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {plan && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Your 30-Day Plan:</h3>
          <p className="whitespace-pre-line">{plan}</p>
        </div>
      )}
    </div>
  );
};

export default ChallengeComponent;

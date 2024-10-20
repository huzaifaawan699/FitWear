import { useState, useRef, useEffect } from 'react';

// Define your API URL and key here
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = "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"; // Replace with your actual API key

async function getGroqChatCompletion(question) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.2-3b-preview", // Update to the model you want to use
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  // Check if data.choices exists and extract content
  if (data.choices && data.choices.length > 0) {
    const content = data.choices[0].message.content.replace(/\*/g, ''); // Remove asterisks
    return content.split('\n').slice(0, 5).join('\n'); // Limit to 5 lines
  } else {
    throw new Error('No valid response from the API');
  }
}

function AIRecommendations() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const endOfChatRef = useRef(null);

  const predefinedQuestions = [
    "What are the best exercises for weight loss?",
    "How can I improve my diet?",
    "What are the benefits of staying hydrated?",
    "How much sleep do I need?",
    "What is the importance of stretching?",
  ];

  async function generateAnswer() {
    if (!question.trim()) return;
    setIsGenerating(true);

    const newChatHistory = [...chatHistory, { type: 'user', text: question }];
    setChatHistory(newChatHistory);
    setQuestion('');

    // Clear previous bot response
    const botResponseIndex = chatHistory.findIndex(chat => chat.type === 'bot');
    if (botResponseIndex !== -1) {
      const updatedChatHistory = [...chatHistory];
      updatedChatHistory.splice(botResponseIndex, 1);
      setChatHistory(updatedChatHistory);
    }

    try {
      const generatedText = await getGroqChatCompletion(question);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', text: generatedText.trim() },
      ]);
    } catch (error) {
      console.error("Error details:", error);
      setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: "I apologize for the inconvenience. There was an error processing your request." }]);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleQuestionChange(e) {
    setQuestion(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnswer();
    }
  }

  async function copyToClipboard(answer) {
    try {
      await navigator.clipboard.writeText(answer);
      setCopySuccess('Copied to clipboard!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  }

  function handlePredefinedQuestion(predefinedQuestion) {
    setQuestion(predefinedQuestion);
    generateAnswer();
  }

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Fitness & Health Chatbot</h1>
        
        {/* Predefined Questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedQuestions.map((pq, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedQuestion(pq)}
              className="bg-gray-300 text-gold-600 font-semibold py-1 px-3 rounded-lg hover:bg-gold-500 transition-all duration-300 ease-in-out">
              {pq}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4 overflow-auto max-h-96">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-3 rounded-lg ${chat.type === 'user' ? 'bg-gold-200 self-end' : 'bg-gray-300 self-start'}`}>
              <p className="text-gray-800 whitespace-pre-line">{chat.text}</p>
              {chat.type === 'bot' && (
                <button 
                  onClick={() => copyToClipboard(chat.text)} 
                  className="mt-1 bg-gray-300 text-gold-600 font-semibold py-1 px-3 rounded-lg hover:bg-gold-500 transition-all duration-300 ease-in-out">
                  Copy
                </button>
              )}
            </div>
          ))}
          <div ref={endOfChatRef} />
        </div>

        <textarea 
          value={question} 
          onChange={handleQuestionChange} 
          onKeyDown={handleKeyDown}
          className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${isGenerating ? "border-gold-500 ring-2 ring-gold-500" : "border-gray-300 focus:ring-gray-500"}`}
          placeholder="Ask me anything about fitness, health, or diet..."
          rows='3'>
        </textarea>

        <div className="flex justify-between">
          <button 
            onClick={generateAnswer} 
            className={`bg-gray-300 text-gold-600 font-semibold py-2 px-4 rounded-lg hover:bg-gold-500 transition-all duration-300 ease-in-out transform ${isGenerating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Send"}
          </button>
          <button 
            onClick={() => setChatHistory([])} 
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform cursor-pointer">
            Clear Chat
          </button>
        </div>
      </div>
      {copySuccess && <p className="text-green-600 text-sm mt-2">{copySuccess}</p>}
    </div>
  );
}

export default AIRecommendations;

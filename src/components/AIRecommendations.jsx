import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function AIRecommendations() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const endOfChatRef = useRef(null); // Ref for scrolling

  const predefinedQuestions = [
    "What are the best exercises for weight loss?",
    "How can I improve my diet?",
    "What are the benefits of staying hydrated?",
    "How much sleep do I need?",
    "What is the importance of stretching?",
  ];

  async function generateAnswer() {
    if (!question.trim()) return; // Prevent generating if the question is empty
    setIsGenerating(true);

    // Add the user's question to the chat history
    const newChatHistory = [...chatHistory, { type: 'user', text: question }];
    setChatHistory(newChatHistory);
    setQuestion('');

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyApRoKI9-oKXp2583R59F7rWKQK_lObIGY",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        const formattedResponse = formatResponse(question, generatedText);
        setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: formattedResponse }]);
      } else {
        setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: "I encountered an unexpected issue while processing your request." }]);
      }
    } catch (error) {
      setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: "I apologize for the inconvenience. There was an error processing your request." }]);
    } finally {
      setIsGenerating(false);
    }
  }

  function formatResponse(question, response) {
    return `**Question:** ${question}\n\n**Response:**\n${response.trim()}\n\n---\n\nIf you have more questions or need further assistance, feel free to ask!`;
  }

  function handleQuestionChange(e) {
    setQuestion(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents default behavior of adding a new line
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

  // Scroll to the bottom of the chat when chatHistory changes
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Fitness & Health Chatbot</h1>
        
        {/* Predefined Questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedQuestions.map((pq, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedQuestion(pq)}
              className="bg-gray-800 text-white font-semibold py-1 px-3 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out">
              {pq}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4 overflow-auto max-h-96">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-3 rounded-lg ${chat.type === 'user' ? 'bg-gray-300 self-end' : 'bg-gray-200 self-start'}`}>
              <p className="text-gray-800 whitespace-pre-line">{chat.text}</p>
              {chat.type === 'bot' && (
                <button 
                  onClick={() => copyToClipboard(chat.text)} 
                  className="mt-1 bg-gray-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-gray-500 transition-all duration-300 ease-in-out">
                  Copy
                </button>
              )}
            </div>
          ))}
          <div ref={endOfChatRef} /> {/* This will be used for scrolling */}
        </div>

        <textarea 
          value={question} 
          onChange={handleQuestionChange} 
          onKeyDown={handleKeyDown}
          className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
            isGenerating ? "border-gray-800 ring-2 ring-gray-800" : "border-gray-300 focus:ring-gray-500"
          }`}
          placeholder="Ask me anything about fitness, health, or diet..."
          rows='3'>
        </textarea>

        <div className="flex justify-between">
          <button 
            onClick={generateAnswer} 
            className={`bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out transform ${isGenerating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

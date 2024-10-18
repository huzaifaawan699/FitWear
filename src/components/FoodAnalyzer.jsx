import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function FoodAnalyzer() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const endOfChatRef = useRef(null); // Ref for scrolling

  const appId = '665da231'; // Replace with your actual app ID
  const appKey = '67bd0cb2ef6370fd9332ad05846e149d'; // Replace with your actual API key

  // Predefined ingredients for selection
  const predefinedIngredients = [
    '1 cup rice',
    '10 ounces chickpeas',
    '1 medium onion',
    '2 cloves garlic',
    '1 pound chicken breast',
    '2 cups spinach',
    '1 avocado',
    '1 tablespoon olive oil',
    '1 teaspoon salt',
    '1 tablespoon lemon juice',
  ];

  async function handleUserInput() {
    if (!userInput.trim()) return; // Prevent empty submissions

    // Add the user's input to the chat history
    const newChatHistory = [...chatHistory, { type: 'user', text: userInput }];
    setChatHistory(newChatHistory);
    
    setIsGenerating(true);
    
    // Clear input field for a better user experience
    const tempInput = userInput; // Keep the input for processing
    setUserInput(''); // Clear input field

    try {
      // Split the user input into separate ingredients
      const ingredients = tempInput.split('\n').map(item => item.trim()).filter(item => item);
      const nutritionDataArray = await Promise.all(ingredients.map(ingredient => 
        axios.get(
          `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&nutrition-type=cooking&ingr=${encodeURIComponent(ingredient)}`
        )
      ));

      // Combine nutritional data from each ingredient
      const combinedNutritionData = combineNutritionData(nutritionDataArray);

      const formattedResponse = formatResponse(combinedNutritionData);
      setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: formattedResponse }]);

    } catch (error) {
      console.error('Error fetching food information:', error);
      setChatHistory((prevHistory) => [...prevHistory, { type: 'bot', text: "There was an error fetching the information. Please try again." }]);
    } finally {
      setIsGenerating(false);
    }
  }

  function combineNutritionData(nutritionDataArray) {
    const combinedData = {
      calories: 0,
      totalNutrients: {
        FAT: { quantity: 0 },
        FA_SAT: { quantity: 0 },
        CHOLE: { quantity: 0 },
        NA: { quantity: 0 },
        CHOCDF: { quantity: 0 },
        FIBTG: { quantity: 0 },
        SUGAR: { quantity: 0 },
        PROCNT: { quantity: 0 },
        VITD: { quantity: 0 },
        CA: { quantity: 0 },
        FE: { quantity: 0 },
        K: { quantity: 0 },
      }
    };

    nutritionDataArray.forEach(nutritionData => {
      if (nutritionData.data) {
        combinedData.calories += nutritionData.data.calories;
        for (const nutrient in nutritionData.data.totalNutrients) {
          if (combinedData.totalNutrients[nutrient]) {
            combinedData.totalNutrients[nutrient].quantity += nutritionData.data.totalNutrients[nutrient]?.quantity || 0;
          }
        }
      }
    });

    return combinedData;
  }

  function formatResponse(nutritionData) {
    return `**Nutrition Facts**\n` +
      `**Amount Per Serving**\n` +
      `**Calories:** ${nutritionData.calories} kcal\n` +
      `**% Daily Value***\n` +
      `**Total Fat:** ${Math.round(nutritionData.totalNutrients.FAT.quantity)} g  (${Math.round((nutritionData.totalNutrients.FAT.quantity / 78) * 100)}%)\n` +
      `**Saturated Fat:** ${Math.round(nutritionData.totalNutrients.FA_SAT.quantity)} g  (${Math.round((nutritionData.totalNutrients.FA_SAT.quantity / 20) * 100)}%)\n` +
      `**Trans Fat:** N/A\n` + 
      `**Cholesterol:** ${Math.round(nutritionData.totalNutrients.CHOLE.quantity)} mg  (${Math.round((nutritionData.totalNutrients.CHOLE.quantity / 300) * 100)}%)\n` +
      `**Sodium:** ${Math.round(nutritionData.totalNutrients.NA.quantity)} mg  (${Math.round((nutritionData.totalNutrients.NA.quantity / 2300) * 100)}%)\n` +
      `**Total Carbohydrate:** ${Math.round(nutritionData.totalNutrients.CHOCDF.quantity)} g  (${Math.round((nutritionData.totalNutrients.CHOCDF.quantity / 275) * 100)}%)\n` +
      `**Dietary Fiber:** ${Math.round(nutritionData.totalNutrients.FIBTG.quantity)} g  (${Math.round((nutritionData.totalNutrients.FIBTG.quantity / 28) * 100)}%)\n` +
      `**Total Sugars:** ${Math.round(nutritionData.totalNutrients.SUGAR.quantity)} g\n` +
      `**Includes - Added Sugars:** N/A\n` + 
      `**Protein:** ${Math.round(nutritionData.totalNutrients.PROCNT.quantity)} g  (${Math.round((nutritionData.totalNutrients.PROCNT.quantity / 50) * 100)}%)\n` +
      `**Vitamin D:** ${Math.round(nutritionData.totalNutrients.VITD.quantity)} µg  (${Math.round((nutritionData.totalNutrients.VITD.quantity / 20) * 100)}%)\n` +
      `**Calcium:** ${Math.round(nutritionData.totalNutrients.CA.quantity)} mg  (${Math.round((nutritionData.totalNutrients.CA.quantity / 1000) * 100)}%)\n` +
      `**Iron:** ${Math.round(nutritionData.totalNutrients.FE.quantity)} mg  (${Math.round((nutritionData.totalNutrients.FE.quantity / 18) * 100)}%)\n` +
      `**Potassium:** ${Math.round(nutritionData.totalNutrients.K.quantity)} mg  (${Math.round((nutritionData.totalNutrients.K.quantity / 3500) * 100)}%)`;
  }

  function handleInputChange(e) {
    setUserInput(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents default behavior of adding a new line
      handleUserInput();
    }
  }

  // Scroll to the bottom of the chat when chatHistory changes
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Function to handle ingredient selection and auto-generate
  const handleIngredientSelect = (ingredient) => {
    setUserInput(prevInput => (prevInput ? `${prevInput}\n${ingredient}` : ingredient)); // Append ingredient to input
    handleUserInput(); // Automatically generate response after selection
  };

  // Function to clear chat history
  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Food Analyzer</h1>

        <div className="flex flex-col space-y-2">
          {predefinedIngredients.map((ingredient, index) => (
            <button 
              key={index} 
              onClick={() => handleIngredientSelect(ingredient)}
              className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              {ingredient}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4 overflow-auto max-h-80 p-2 bg-gray-100 rounded-lg shadow-inner">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-3 rounded-lg ${chat.type === 'user' ? 'bg-black text-white self-end' : 'bg-gray-300 text-gray-800 self-start'}`}>
              <p className="whitespace-pre-line">{chat.text}</p>
            </div>
          ))}
          <div ref={endOfChatRef} /> {/* This will be used for scrolling */}
        </div>

        <textarea 
          value={userInput} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none border-gray-300 focus:ring-black ${isGenerating ? "border-green-500 ring-2 ring-green-500" : ""}`}
          placeholder="Type your ingredients here (e.g., '1 cup rice' or '10 ounces chickpeas')..."
          rows='4'>
        </textarea>

        <div className="flex space-x-2">
          <button 
            onClick={handleUserInput} 
            className={`bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isGenerating}
          >
            {isGenerating ? 'Analyzing...' : 'Analyze'}
          </button>
          <button 
            onClick={clearChatHistory}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodAnalyzer;

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function FoodAnalyzer() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
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

    const newChatHistory = [...chatHistory, { type: 'user', text: userInput }];
    setChatHistory(newChatHistory);

    setIsGenerating(true);

    const tempInput = userInput;
    setUserInput('');

    try {
      const ingredients = tempInput.split('\n').map(item => item.trim()).filter(item => item);
      const nutritionDataArray = await Promise.all(ingredients.map(ingredient => 
        axios.get(
          `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&nutrition-type=cooking&ingr=${encodeURIComponent(ingredient)}`
        )
      ));

      const combinedNutritionData = combineNutritionData(nutritionDataArray);
      setNutritionData(combinedNutritionData); // Save combined data for table display

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
    return `Nutrition analysis complete. Below is the table with details.`;
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

  const handleIngredientSelect = (ingredient) => {
    setUserInput(prevInput => (prevInput ? `${prevInput}\n${ingredient}` : ingredient)); // Append ingredient to input
    handleUserInput();
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setNutritionData(null); // Clear table as well
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Food Analyzer</h1>

        <div className="flex flex-col space-y-2">
          {predefinedIngredients.map((ingredient, index) => (
            <button 
              key={index} 
              onClick={() => handleIngredientSelect(ingredient)}
              className="bg-gold text-black rounded-lg px-4 py-2 hover:bg-yellow-400 transition duration-300 ease-in-out"
            >
              {ingredient}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4 overflow-auto max-h-80 p-2 bg-gray-200 rounded-lg shadow-inner">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-3 rounded-lg ${chat.type === 'user' ? 'bg-gold text-black self-end' : 'bg-gray-300 text-gray-800 self-start'}`}>
              <p className="whitespace-pre-line">{chat.text}</p>
            </div>
          ))}
          <div ref={endOfChatRef} />
        </div>

        {nutritionData && (
          <div className="overflow-auto max-h-80 p-2 bg-gray-200 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Nutrition Facts</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-400 text-left text-sm">
              <thead className="bg-gray-300 text-gray-800">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Nutrient</th>
                  <th className="border border-gray-400 px-4 py-2">Amount</th>
                  <th className="border border-gray-400 px-4 py-2">% Daily Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Calories</td>
                  <td className="border border-gray-300 px-4 py-2">{nutritionData.calories} kcal</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Fat</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.FAT.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.FAT.quantity / 78) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Saturated Fat</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.FA_SAT.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.FA_SAT.quantity / 20) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Cholesterol</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.CHOLE.quantity)} mg</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.CHOLE.quantity / 300) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Sodium</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.NA.quantity)} mg</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.NA.quantity / 2300) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Carbohydrate</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.CHOCDF.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.CHOCDF.quantity / 300) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Dietary Fiber</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.FIBTG.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.FIBTG.quantity / 25) * 100)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Sugars</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.SUGAR.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Protein</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round(nutritionData.totalNutrients.PROCNT.quantity)} g</td>
                  <td className="border border-gray-300 px-4 py-2">{Math.round((nutritionData.totalNutrients.PROCNT.quantity / 50) * 100)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <textarea
          rows="3"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter ingredients (one per line)..."
          className="border border-gray-400 rounded-lg p-2 resize-none w-full bg-gray-200 text-gray-800"
        />
        <button
          onClick={handleUserInput}
          className={`bg-gold text-black rounded-lg px-4 py-2 hover:bg-yellow-400 transition duration-300 ease-in-out ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isGenerating}
        >
          {isGenerating ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={clearChatHistory}
          className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400 transition duration-300 ease-in-out"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default FoodAnalyzer;

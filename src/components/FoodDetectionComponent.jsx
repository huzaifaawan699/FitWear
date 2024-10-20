// src/components/FoodDetectionComponent.jsx
import React, { useState } from 'react';

const FoodDetectionComponent = () => {
  const [image, setImage] = useState(null); // Holds image data
  const [result, setResult] = useState(null); // Holds the AI result
  const [loading, setLoading] = useState(false); // Handles loading state

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set image to base64 data
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to send image to Llama 3.2 API for food detection and nutrition details
  const analyzeFood = async () => {
    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`, // Replace with your actual API key
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Detect this food and provide nutrition details including percentages.' },
                { type: 'image_url', image_url: { url: image } },
              ],
            },
          ],
          model: 'llama-3.2-90b-vision-preview',
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null,
        }),
      });

      const data = await response.json();
      setResult(data.choices[0].message.content); // Set result
    } catch (error) {
      console.error('Error detecting food:', error);
      setResult('Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800">Food Detection & Nutrition Info</h1>

      {/* Image Upload */}
      <div className="flex flex-col items-center mb-8">
        <label htmlFor="upload" className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-700 focus:outline-none">
          Upload Image
        </label>
        <input id="upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Display uploaded image */}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded" className="w-64 h-64 object-cover rounded-lg shadow-lg" />
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={analyzeFood}
        className={`mt-8 bg-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-700 focus:outline-none ${loading && 'cursor-not-allowed opacity-50'}`}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Food'}
      </button>

      {/* Result Display */}
      {result && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Nutrition Information</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-gray-700">Nutrient</th>
                <th className="border border-gray-300 px-4 py-2 text-gray-700">Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {result.split(',').map((item, index) => {
                const [nutrient, amount, percentage] = item.split(':').map(part => part?.trim());
                return (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{nutrient}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{amount}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{percentage || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FoodDetectionComponent;

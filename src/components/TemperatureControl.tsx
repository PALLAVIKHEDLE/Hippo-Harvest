import React, { useState, useEffect } from 'react';

interface Props {
  currentTemperature: number;
  targetTemperature: number;
  onTemperatureChange: (temperature: number) => void;
}

export default function TemperatureControl({
  currentTemperature,
  targetTemperature,
  onTemperatureChange,
}: Props) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [tempValue, setTempValue] = useState(targetTemperature);

  // Update tempValue when targetTemperature changes
  useEffect(() => {
    setTempValue(targetTemperature);
  }, [targetTemperature]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTemperatureChange(tempValue);
    setIsAdjusting(false);
  };

  // Temperature limits in Celsius
  const MIN_TEMP = 15;
  const MAX_TEMP = 40; // Increased maximum temperature to 40°C

  const handleIncrement = () => {
    const newTemp = Math.min(Math.round(tempValue + 1), MAX_TEMP);
    setTempValue(newTemp);
  };

  const handleDecrement = () => {
    const newTemp = Math.max(Math.round(tempValue - 1), MIN_TEMP);
    setTempValue(newTemp);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Temperature Control</h3>
        <button
          onClick={() => {
            setIsAdjusting(!isAdjusting);
            setTempValue(targetTemperature); // Reset to current target when toggling
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none"
        >
          {isAdjusting ? 'Cancel' : 'Adjust'}
        </button>
      </div>

      {isAdjusting ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none"
            >
              -
            </button>
            <div className="mx-6 text-center">
              <div className="text-4xl font-bold text-gray-800">{Math.round(tempValue)}°C</div>
              <div className="text-sm text-gray-500">Target Temperature</div>
            </div>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none"
            >
              +
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Temperature
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Current</div>
              <div className="text-xl font-semibold text-gray-800">
                {Math.round(currentTemperature)}°C
              </div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Target</div>
              <div className="text-xl font-semibold text-gray-800">
                {Math.round(targetTemperature)}°C
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

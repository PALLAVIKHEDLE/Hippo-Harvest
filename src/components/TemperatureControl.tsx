import React, { useState } from 'react';

interface Props {
  facilityId: string;
  currentTemperature: number;
  targetTemperature: number;
  onTemperatureChange: (id: string, temperature: number) => void;
}

export default function TemperatureControl({
  facilityId,
  currentTemperature,
  targetTemperature,
  onTemperatureChange,
}: Props) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [tempValue, setTempValue] = useState(targetTemperature);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTemperatureChange(facilityId, tempValue);
    setIsAdjusting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Temperature Control</h3>
        <button
          onClick={() => setIsAdjusting(!isAdjusting)}
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
              onClick={() => setTempValue((prev) => Math.max(prev - 1, 0))}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none"
            >
              -
            </button>
            <div className="mx-6 text-center">
              <div className="text-4xl font-bold text-gray-800">{tempValue}°C</div>
              <div className="text-sm text-gray-500">Target Temperature</div>
            </div>
            <button
              type="button"
              onClick={() => setTempValue((prev) => Math.min(prev + 1, 35))}
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
              <div className="text-xl font-semibold text-gray-800">{targetTemperature}°C</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

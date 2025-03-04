import React, { useState } from 'react';
import { useFacilities } from '../context/FacilityContext';

export default function AddFacility() {
  const [cityName, setCityName] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { addFacility } = useFacilities();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await addFacility(cityName, stateCode);
      setCityName('');
      setStateCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add facility');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Facility</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cityName" className="block text-sm font-medium text-gray-700 mb-1">
            City Name
          </label>
          <input
            type="text"
            id="cityName"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="e.g., San Francisco"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="stateCode" className="block text-sm font-medium text-gray-700 mb-1">
            State Code (US only)
          </label>
          <input
            type="text"
            id="stateCode"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value.toUpperCase())}
            placeholder="e.g., CA"
            maxLength={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Optional. Leave empty for non-US cities.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !cityName}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLoading || !cityName
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding Facility...
            </span>
          ) : (
            'Add Facility'
          )}
        </button>

        {/* Quick Add Suggestions */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { city: 'Boston', state: 'MA' },
              { city: 'Austin', state: 'TX' },
              { city: 'Denver', state: 'CO' },
              { city: 'Portland', state: 'OR' },
            ].map(({ city, state }) => (
              <button
                key={`${city}-${state}`}
                type="button"
                onClick={() => {
                  setCityName(city);
                  setStateCode(state);
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {city}, {state}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useFacilities } from './context/FacilityContext';
import AddFacility from './components/AddFacility';
import StateSelector from './components/StateSelector';
import FacilityCard from './components/FacilityCard';

function App() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { facilities = [], loading, error } = useFacilities();

  // Filter facilities by selected state
  const filteredFacilities =
    selectedState && facilities
      ? facilities.filter((f) => f?.location?.state === selectedState)
      : facilities;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Temperature Control Dashboard</h1>
          <p className="text-lg text-gray-600">
            Monitor and manage facility temperatures in real-time
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Facility Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Facility</h2>
                  <AddFacility />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Facilities List */}
          <div className="lg:col-span-2">
            {/* State Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 text-red-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Facilities Grid */}
            {!loading && !error && (
              <div>
                {filteredFacilities && filteredFacilities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFacilities.map((facility) =>
                      facility ? <FacilityCard key={facility.id} facility={facility} /> : null
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedState ? `No Facilities in ${selectedState}` : 'No Facilities Found'}
                    </h3>
                    <p className="text-gray-600">
                      {selectedState
                        ? 'Try selecting a different state or add a new facility.'
                        : 'Add your first facility using the form on the left.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

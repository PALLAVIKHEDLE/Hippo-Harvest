import React, { useState } from 'react';
import { useFacilities } from '../context/FacilityContext';
import FacilityCard from '../components/FacilityCard';
import StateSelector from '../components/StateSelector';

export default function Dashboard() {
  const { facilities, loading, error } = useFacilities();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Filter facilities by selected state
  const filteredFacilities = selectedState
    ? facilities.filter((f) => f.location.state === selectedState)
    : facilities;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-200 rounded-lg w-96"></div>
          <div className="h-48 bg-gray-200 rounded-lg w-96"></div>
          <div className="h-48 bg-gray-200 rounded-lg w-96"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
          <h2 className="text-lg font-semibold mb-2">Error Loading Facilities</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 p-8 rounded-lg inline-block">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Facilities Found</h2>
          <p className="text-gray-600 mb-4">Start by adding a facility using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>

      {selectedState && filteredFacilities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No facilities found in {selectedState}</p>
        </div>
      )}
    </div>
  );
}

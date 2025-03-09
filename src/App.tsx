import React, { useState } from 'react';
import { useFacilities, FacilityProvider } from './context/FacilityContext';
import { GlobalSettingsProvider } from './context/GlobalSettingsContext';
import FacilityCard from './components/FacilityCard';
import AddFacilityModal from './components/AddFacilityModal';
import { Cog6ToothIcon as CogIcon, PlusIcon } from '@heroicons/react/24/outline';
import GlobalSettings from './components/GlobalSettings';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { facilities = [], loading, deleteFacility, updateFacilityTemperature } = useFacilities();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Temperature Control System</h1>
            <p className="mt-2 text-sm text-gray-900">
              Monitor and manage facility temperatures in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Facility
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg focus:outline-none"
              title="Global Settings"
            >
              <CogIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse border border-primary-100"
              >
                <div className="h-8 bg-primary-50 rounded w-3/4 mb-4"></div>
                <div className="h-24 bg-primary-50 rounded mb-4"></div>
                <div className="h-12 bg-primary-50 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div>
            {facilities && facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility) =>
                  facility ? (
                    <FacilityCard
                      key={facility.id}
                      facility={facility}
                      onDelete={deleteFacility}
                      onTemperatureChange={updateFacilityTemperature}
                    />
                  ) : null
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-primary-700 mb-2">No Facilities Found</h3>
                <p className="text-primary-600 mb-6">Add your first facility to get started</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Facility
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <GlobalSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AddFacilityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <GlobalSettingsProvider>
      <FacilityProvider>
        <AppContent />
      </FacilityProvider>
    </GlobalSettingsProvider>
  );
}

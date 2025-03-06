import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Cog6ToothIcon as CogIcon } from '@heroicons/react/24/outline';
import { GlobalSettingsContext } from '../context/GlobalSettingsContext';
import { FacilityContext } from '../context/FacilityContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSettings: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const context = React.useContext(GlobalSettingsContext);
  const { resetToLocal, loading } = React.useContext(FacilityContext);

  if (!context) {
    throw new Error('GlobalSettings must be used within a GlobalSettingsProvider');
  }
  const {
    temperaturePresets,
    setTemperaturePresets,
    temperatureThresholds,
    setTemperatureThresholds,
    seasonalProfiles,
    setSeasonalProfiles,
    energySavingBands,
    setEnergySavingBands,
  } = context;

  // Create local state to store changes before saving
  const [localSettings, setLocalSettings] = useState({
    temperaturePresets,
    temperatureThresholds,
    seasonalProfiles,
    energySavingBands,
  });

  // Update local settings when global settings change
  React.useEffect(() => {
    setLocalSettings({
      temperaturePresets,
      temperatureThresholds,
      seasonalProfiles,
      energySavingBands,
    });
  }, [temperaturePresets, temperatureThresholds, seasonalProfiles, energySavingBands]);

  const handleSave = () => {
    // Update all settings at once
    setTemperaturePresets(localSettings.temperaturePresets);
    setTemperatureThresholds(localSettings.temperatureThresholds);
    setSeasonalProfiles(localSettings.seasonalProfiles);
    setEnergySavingBands(localSettings.energySavingBands);

    // Show success message
    const notification = document.createElement('div');
    notification.className =
      'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] animate-fade-in';
    notification.textContent = 'Settings saved successfully!';
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);

    onClose();
  };

  const tabs = [
    {
      name: 'Temperature',
      icon: '🌡️',
      tooltip: 'Set day, night & weekend temperature presets',
    },
    {
      name: 'Seasonal',
      icon: '🍂',
      tooltip: 'Configure temperature profiles for each season',
    },
    {
      name: 'Energy',
      icon: '⚡',
      tooltip: 'Manage peak and off-peak energy usage bands',
    },
    {
      name: 'Alerts',
      icon: '🔔',
      tooltip: 'Set temperature thresholds for notifications',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg w-3/4 max-w-4xl h-[calc(100vh-120px)] overflow-hidden shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <CogIcon className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold">Global Settings</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 p-4 bg-gray-100">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium focus:outline-none ${
                      selected
                        ? 'bg-white shadow text-blue-600'
                        : 'text-gray-600 hover:bg-white/[0.5] hover:text-gray-700'
                    }`
                  }
                >
                  <span className="flex items-center space-x-2 group relative">
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                    <span className="ml-1 text-gray-400 group-hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <div className="absolute bottom-full left-1/2  mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {tab.tooltip}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Temperature Presets Panel */}
                <Tab.Panel>
                  <div className="space-y-6">
                    {/* Local Weather Sync */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Local Weather Sync</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Reset all facilities to match their local weather temperatures
                          </p>
                        </div>
                        <button
                          onClick={() => resetToLocal()}
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reset all facilities to their local weather temperature (defaults to 22°C if weather data unavailable)"
                        >
                          <span className="mr-2">🌡️</span>
                          Reset All Facilities
                          {loading && ' ...'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded p-3 flex items-start">
                        <span className="text-amber-500 mr-2">⚠️</span>
                        <p>
                          If weather data is unavailable for any facility, its temperature will
                          default to 22°C (comfort temperature)
                        </p>
                      </div>
                    </div>

                    {/* Daily Temperature Presets */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-4">Daily Temperature Presets</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Day Temperature (°C)
                          </label>
                          <input
                            type="number"
                            value={localSettings.temperaturePresets.day}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperaturePresets: {
                                  ...localSettings.temperaturePresets,
                                  day: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Night Temperature (°C)
                          </label>
                          <input
                            type="number"
                            value={localSettings.temperaturePresets.night}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperaturePresets: {
                                  ...localSettings.temperaturePresets,
                                  night: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Weekend Temperature (°C)
                          </label>
                          <input
                            type="number"
                            value={localSettings.temperaturePresets.weekend}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperaturePresets: {
                                  ...localSettings.temperaturePresets,
                                  weekend: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-4">Temperature Thresholds</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Minimum Temperature (°C)
                          </label>
                          <input
                            type="number"
                            value={localSettings.temperatureThresholds.min}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperatureThresholds: {
                                  ...localSettings.temperatureThresholds,
                                  min: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Maximum Temperature (°C)
                          </label>
                          <input
                            type="number"
                            value={localSettings.temperatureThresholds.max}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperatureThresholds: {
                                  ...localSettings.temperatureThresholds,
                                  max: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Seasonal Profiles Panel */}
                <Tab.Panel>
                  <div className="space-y-6">
                    {Object.entries(localSettings.seasonalProfiles).map(([season, temps]) => (
                      <div key={season} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4 capitalize">{season} Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Day Temperature (°C)
                            </label>
                            <input
                              type="number"
                              value={temps.day}
                              onChange={(e) =>
                                setLocalSettings({
                                  ...localSettings,
                                  seasonalProfiles: {
                                    ...localSettings.seasonalProfiles,
                                    [season]: { ...temps, day: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full border rounded-md p-2"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Night Temperature (°C)
                            </label>
                            <input
                              type="number"
                              value={temps.night}
                              onChange={(e) =>
                                setLocalSettings({
                                  ...localSettings,
                                  seasonalProfiles: {
                                    ...localSettings.seasonalProfiles,
                                    [season]: { ...temps, night: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full border rounded-md p-2"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Weekend Temperature (°C)
                            </label>
                            <input
                              type="number"
                              value={temps.weekend}
                              onChange={(e) =>
                                setLocalSettings({
                                  ...localSettings,
                                  seasonalProfiles: {
                                    ...localSettings.seasonalProfiles,
                                    [season]: { ...temps, weekend: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full border rounded-md p-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                {/* Energy Saving Panel */}
                <Tab.Panel>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Energy Saving Mode</h3>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={localSettings.energySavingBands.enabled}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                energySavingBands: {
                                  ...localSettings.energySavingBands,
                                  enabled: e.target.checked,
                                },
                              })
                            }
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Enable</span>
                        </label>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-md font-medium mb-3">Peak Hours</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Day Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.peakHours.day}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      peakHours: {
                                        ...localSettings.energySavingBands.peakHours,
                                        day: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Night Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.peakHours.night}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      peakHours: {
                                        ...localSettings.energySavingBands.peakHours,
                                        night: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Weekend Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.peakHours.weekend}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      peakHours: {
                                        ...localSettings.energySavingBands.peakHours,
                                        weekend: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-medium mb-3">Off-Peak Hours</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Day Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.offPeakHours.day}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      offPeakHours: {
                                        ...localSettings.energySavingBands.offPeakHours,
                                        day: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Night Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.offPeakHours.night}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      offPeakHours: {
                                        ...localSettings.energySavingBands.offPeakHours,
                                        night: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Weekend Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={localSettings.energySavingBands.offPeakHours.weekend}
                                onChange={(e) =>
                                  setLocalSettings({
                                    ...localSettings,
                                    energySavingBands: {
                                      ...localSettings.energySavingBands,
                                      offPeakHours: {
                                        ...localSettings.energySavingBands.offPeakHours,
                                        weekend: Number(e.target.value),
                                      },
                                    },
                                  })
                                }
                                className="w-full border rounded-md p-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Alerts Panel */}
                <Tab.Panel>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Temperature Alerts</h3>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={localSettings.temperatureThresholds.alertEnabled}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                temperatureThresholds: {
                                  ...localSettings.temperatureThresholds,
                                  alertEnabled: e.target.checked,
                                },
                              })
                            }
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Enable Alerts</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Get notified when temperatures exceed the defined thresholds
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="font-medium mb-2">Current Thresholds:</div>
                          <div className="text-sm text-gray-600">
                            Minimum: {localSettings.temperatureThresholds.min}°C
                          </div>
                          <div className="text-sm text-gray-600">
                            Maximum: {localSettings.temperatureThresholds.max}°C
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </div>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Global Actions */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Global Actions</h3>
        <button
          onClick={() => resetToLocal()}
          disabled={loading}
          className="w-full bg-white text-blue-600 hover:text-blue-800 border border-blue-600 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset all facilities to their local weather temperature (defaults to 22°C if weather data unavailable)"
        >
          Reset All to Local Temperature
          {loading && ' ...'}
        </button>
      </div>
    </div>
  );
};

export default GlobalSettings;

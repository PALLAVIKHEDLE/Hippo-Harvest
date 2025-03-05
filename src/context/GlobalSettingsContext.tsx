import React, { createContext, useContext, useState, useEffect } from 'react';

interface TemperaturePreset {
  day: number;
  night: number;
  weekend: number;
}

interface TemperatureThresholds {
  min: number;
  max: number;
  alertEnabled: boolean;
}

interface SeasonalProfile {
  winter: TemperaturePreset;
  spring: TemperaturePreset;
  summer: TemperaturePreset;
  fall: TemperaturePreset;
}

interface EnergySavingBands {
  peakHours: TemperaturePreset;
  offPeakHours: TemperaturePreset;
  enabled: boolean;
}

interface GlobalSettingsContextType {
  temperaturePresets: TemperaturePreset;
  setTemperaturePresets: (presets: TemperaturePreset) => void;
  temperatureThresholds: TemperatureThresholds;
  setTemperatureThresholds: (thresholds: TemperatureThresholds) => void;
  seasonalProfiles: SeasonalProfile;
  setSeasonalProfiles: (profiles: SeasonalProfile) => void;
  energySavingBands: EnergySavingBands;
  setEnergySavingBands: (bands: EnergySavingBands) => void;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

export function GlobalSettingsProvider({ children }: { children: React.ReactNode }) {
  const [temperaturePresets, setTemperaturePresets] = useState<TemperaturePreset>({
    day: 22, // Default day temperature (22°C)
    night: 18, // Default night temperature (18°C)
    weekend: 20, // Default weekend temperature (20°C)
  });

  const [temperatureThresholds, setTemperatureThresholds] = useState<TemperatureThresholds>({
    min: 16, // Minimum allowed temperature
    max: 28, // Maximum allowed temperature
    alertEnabled: true,
  });

  const [seasonalProfiles, setSeasonalProfiles] = useState<SeasonalProfile>({
    winter: { day: 21, night: 17, weekend: 19 },
    spring: { day: 22, night: 18, weekend: 20 },
    summer: { day: 24, night: 20, weekend: 22 },
    fall: { day: 22, night: 18, weekend: 20 },
  });

  const [energySavingBands, setEnergySavingBands] = useState<EnergySavingBands>({
    peakHours: { day: 24, night: 20, weekend: 22 },
    offPeakHours: { day: 20, night: 18, weekend: 19 },
    enabled: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadedPresets = localStorage.getItem('temperaturePresets');
    const loadedThresholds = localStorage.getItem('temperatureThresholds');
    const loadedProfiles = localStorage.getItem('seasonalProfiles');
    const loadedBands = localStorage.getItem('energySavingBands');

    if (loadedPresets) setTemperaturePresets(JSON.parse(loadedPresets));
    if (loadedThresholds) setTemperatureThresholds(JSON.parse(loadedThresholds));
    if (loadedProfiles) setSeasonalProfiles(JSON.parse(loadedProfiles));
    if (loadedBands) setEnergySavingBands(JSON.parse(loadedBands));
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('temperaturePresets', JSON.stringify(temperaturePresets));
    localStorage.setItem('temperatureThresholds', JSON.stringify(temperatureThresholds));
    localStorage.setItem('seasonalProfiles', JSON.stringify(seasonalProfiles));
    localStorage.setItem('energySavingBands', JSON.stringify(energySavingBands));
  }, [temperaturePresets, temperatureThresholds, seasonalProfiles, energySavingBands]);

  return (
    <GlobalSettingsContext.Provider
      value={{
        temperaturePresets,
        setTemperaturePresets,
        temperatureThresholds,
        setTemperatureThresholds,
        seasonalProfiles,
        setSeasonalProfiles,
        energySavingBands,
        setEnergySavingBands,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
}

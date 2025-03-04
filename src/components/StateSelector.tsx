import React from 'react';
import { useFacilities } from '../context/FacilityContext';

interface Props {
  onStateChange: (state: string | null) => void;
  selectedState: string | null;
}

export default function StateSelector({ onStateChange, selectedState }: Props) {
  const { facilities } = useFacilities();

  // Get unique states from facilities
  const states = Array.from(new Set(facilities.map((f) => f.location.state)))
    .filter(Boolean)
    .sort();

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="stateFilter" className="text-gray-700 font-medium">
        Filter by State:
      </label>
      <select
        id="stateFilter"
        value={selectedState || ''}
        onChange={(e) => onStateChange(e.target.value || null)}
        className="form-select rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">All States</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
}

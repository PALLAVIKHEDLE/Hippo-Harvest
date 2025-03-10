import React, { useState, useEffect } from 'react';
import { useFacilities } from '../context/FacilityContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFacilityModal({ isOpen, onClose }: Props) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const { addFacility } = useFacilities();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await addFacility(city, state);
      setCity('');
      setState('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add facility');
    }
  };

  const handleClose = () => {
    setError('');
    setCity('');
    setState('');
    onClose();
  };

  // Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setError('');
      setCity('');
      setState('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Facility</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Enter city name"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State Code
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g. CA, NY"
              maxLength={2}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Add Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

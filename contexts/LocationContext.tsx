import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Address } from '@/types';

interface LocationContextType {
  currentLocation: Address | null;
  setCurrentLocation: (location: Address) => void;
  isWithinLagos: (location: Address) => boolean;
  getDeliveryFee: (location: Address) => number;
  getDeliveryTime: (location: Address) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const lagosAreas = [
  'ikeja', 'victoria island', 'ikoyi', 'lekki', 'surulere', 'yaba', 'mainland',
  'island', 'ajah', 'gbagada', 'ketu', 'ojodu', 'magodo', 'anthony', 'maryland',
  'ogudu', 'palmgrove', 'shomolu', 'bariga', 'ilupeju', 'mushin', 'oshodi',
  'alaba', 'festac', 'satellite town', 'badagry', 'epe', 'ikorodu', 'agege'
];

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Address | null>(null);

  const isWithinLagos = (location: Address): boolean => {
    const locationText = `${location.city} ${location.street}`.toLowerCase();
    return lagosAreas.some(area => locationText.includes(area)) || 
           location.state.toLowerCase().includes('lagos');
  };

  const getDeliveryFee = (location: Address): number => {
    if (isWithinLagos(location)) {
      return 2000; // ₦2,000 within Lagos
    }
    
    // Check if it's within Nigeria (not international)
    const nigerianStates = [
      'abia', 'adamawa', 'akwa ibom', 'anambra', 'bauchi', 'bayelsa', 'benue',
      'borno', 'cross river', 'delta', 'ebonyi', 'edo', 'ekiti', 'enugu',
      'gombe', 'imo', 'jigawa', 'kaduna', 'kano', 'katsina', 'kebbi', 'kogi',
      'kwara', 'lagos', 'nasarawa', 'niger', 'ogun', 'ondo', 'osun', 'oyo',
      'plateau', 'rivers', 'sokoto', 'taraba', 'yobe', 'zamfara', 'fct'
    ];
    
    const isNigerian = nigerianStates.some(state => 
      location.state.toLowerCase().includes(state)
    );
    
    if (isNigerian) {
      return 4000; // ₦4,000 outside Lagos but within Nigeria
    }
    
    return -1; // International - custom pricing
  };

  const getDeliveryTime = (location: Address): string => {
    if (isWithinLagos(location)) {
      return '2-4 hours'; // Within Lagos
    }
    
    // Check if it's within Nigeria
    const nigerianStates = [
      'abia', 'adamawa', 'akwa ibom', 'anambra', 'bauchi', 'bayelsa', 'benue',
      'borno', 'cross river', 'delta', 'ebonyi', 'edo', 'ekiti', 'enugu',
      'gombe', 'imo', 'jigawa', 'kaduna', 'kano', 'katsina', 'kebbi', 'kogi',
      'kwara', 'lagos', 'nasarawa', 'niger', 'ogun', 'ondo', 'osun', 'oyo',
      'plateau', 'rivers', 'sokoto', 'taraba', 'yobe', 'zamfara', 'fct'
    ];
    
    const isNigerian = nigerianStates.some(state => 
      location.state.toLowerCase().includes(state)
    );
    
    if (isNigerian) {
      return '4-7 days'; // Outside Lagos but within Nigeria
    }
    
    return 'Custom delivery'; // International
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      isWithinLagos,
      getDeliveryFee,
      getDeliveryTime,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
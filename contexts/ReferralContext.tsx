import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  points: number;
  referredUsers: string[];
  totalEarnings: number;
}

interface ReferralContextType {
  referralData: ReferralData;
  generateReferralCode: () => Promise<void>;
  addReferralPoint: (referredUserId: string) => Promise<void>;
  convertPointsToCash: (points: number) => Promise<boolean>;
  getReferralStats: () => { totalReferrals: number; totalEarnings: number; availablePoints: number };
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referralLink: '',
    points: 0,
    referredUsers: [],
    totalEarnings: 0,
  });

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const data = await AsyncStorage.getItem('referralData');
      if (data) {
        setReferralData(JSON.parse(data));
      } else {
        // Generate initial referral code for new users
        await generateReferralCode();
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };

  const saveReferralData = async (data: ReferralData) => {
    try {
      await AsyncStorage.setItem('referralData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving referral data:', error);
    }
  };

  const generateReferralCode = async () => {
    // Generate a unique referral code
    const code = `LUXUIRE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const link = `https://luxuire.com/app?ref=${code}`;
    
    const newData = {
      ...referralData,
      referralCode: code,
      referralLink: link,
    };
    
    setReferralData(newData);
    await saveReferralData(newData);
  };

  const addReferralPoint = async (referredUserId: string) => {
    if (referralData.referredUsers.includes(referredUserId)) {
      return; // User already referred
    }

    const newData = {
      ...referralData,
      points: referralData.points + 1, // Each referral gets 1 point
      referredUsers: [...referralData.referredUsers, referredUserId],
    };
    
    setReferralData(newData);
    await saveReferralData(newData);
  };

  const convertPointsToCash = async (points: number): Promise<boolean> => {
    if (points > referralData.points || points < 100) {
      return false; // Not enough points or below minimum
    }

    const cashValue = points * 0.10; // ₦0.10 per point
    
    const newData = {
      ...referralData,
      points: referralData.points - points,
      totalEarnings: referralData.totalEarnings + cashValue,
    };
    
    setReferralData(newData);
    await saveReferralData(newData);
    
    return true;
  };

  const getReferralStats = () => {
    return {
      totalReferrals: referralData.referredUsers.length,
      totalEarnings: referralData.totalEarnings,
      availablePoints: referralData.points,
    };
  };

  return (
    <ReferralContext.Provider value={{
      referralData,
      generateReferralCode,
      addReferralPoint,
      convertPointsToCash,
      getReferralStats,
    }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}
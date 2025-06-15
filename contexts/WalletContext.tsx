import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletTransaction } from '@/types';
import { useAuth } from './AuthContext';

interface WalletContextType {
  transactions: WalletTransaction[];
  balance: number;
  addFunds: (amount: number, reference: string) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  getTransactionHistory: () => WalletTransaction[];
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      loadWalletData();
      setBalance(user.walletBalance || 0);
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    
    try {
      const walletData = await AsyncStorage.getItem(`wallet_${user.id}`);
      if (walletData) {
        const data = JSON.parse(walletData);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const saveWalletData = async (newTransactions: WalletTransaction[]) => {
    if (!user) return;
    
    try {
      const walletData = {
        transactions: newTransactions,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`wallet_${user.id}`, JSON.stringify(walletData));
    } catch (error) {
      console.error('Error saving wallet data:', error);
    }
  };

  const addFunds = async (amount: number, reference: string): Promise<boolean> => {
    if (!user || amount <= 0) return false;

    try {
      const transaction: WalletTransaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Wallet funding via Paystack',
        reference,
        status: 'completed',
        createdAt: new Date(),
      };

      const newTransactions = [transaction, ...transactions];
      const newBalance = balance + amount;

      setTransactions(newTransactions);
      setBalance(newBalance);
      
      // Update user's wallet balance
      await updateUser({
        walletBalance: newBalance
      });
      
      // Save transaction history
      await saveWalletData(newTransactions);

      return true;
    } catch (error) {
      console.error('Error adding funds:', error);
      return false;
    }
  };

  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
    if (!user || amount <= 0 || balance < amount) return false;

    try {
      const transaction: WalletTransaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description,
        status: 'completed',
        createdAt: new Date(),
      };

      const newTransactions = [transaction, ...transactions];
      const newBalance = balance - amount;

      setTransactions(newTransactions);
      setBalance(newBalance);
      
      // Update user's wallet balance
      await updateUser({
        walletBalance: newBalance
      });
      
      // Save transaction history
      await saveWalletData(newTransactions);

      return true;
    } catch (error) {
      console.error('Error deducting funds:', error);
      return false;
    }
  };

  const getTransactionHistory = () => {
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const refreshBalance = async () => {
    if (user) {
      setBalance(user.walletBalance || 0);
    }
  };

  return (
    <WalletContext.Provider value={{
      transactions,
      balance,
      addFunds,
      deductFunds,
      getTransactionHistory,
      refreshBalance,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
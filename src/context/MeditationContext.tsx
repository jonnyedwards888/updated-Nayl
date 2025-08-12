import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MeditationContextType {
  isMeditationActive: boolean;
  setIsMeditationActive: (active: boolean) => void;
}

const MeditationContext = createContext<MeditationContextType | undefined>(undefined);

export const useMeditation = () => {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
};

interface MeditationProviderProps {
  children: ReactNode;
}

export const MeditationProvider: React.FC<MeditationProviderProps> = ({ children }) => {
  const [isMeditationActive, setIsMeditationActive] = useState(false);

  return (
    <MeditationContext.Provider value={{ isMeditationActive, setIsMeditationActive }}>
      {children}
    </MeditationContext.Provider>
  );
};

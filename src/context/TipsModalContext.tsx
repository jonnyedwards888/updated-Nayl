import React, { createContext, useContext, useState } from 'react';

interface TipsModalContextType {
  isTipsModalVisible: boolean;
  setIsTipsModalVisible: (visible: boolean) => void;
}

const TipsModalContext = createContext<TipsModalContextType | undefined>(undefined);

export const TipsModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTipsModalVisible, setIsTipsModalVisible] = useState(false);

  return (
    <TipsModalContext.Provider value={{ isTipsModalVisible, setIsTipsModalVisible }}>
      {children}
    </TipsModalContext.Provider>
  );
};

export const useTipsModal = (): TipsModalContextType => {
  const context = useContext(TipsModalContext);
  if (context === undefined) {
    throw new Error('useTipsModal must be used within a TipsModalProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PanicModalContextType {
  isPanicModalVisible: boolean;
  setIsPanicModalVisible: (visible: boolean) => void;
}

const PanicModalContext = createContext<PanicModalContextType | undefined>(undefined);

interface PanicModalProviderProps {
  children: ReactNode;
}

export const PanicModalProvider: React.FC<PanicModalProviderProps> = ({ children }) => {
  const [isPanicModalVisible, setIsPanicModalVisible] = useState(false);

  return (
    <PanicModalContext.Provider value={{ isPanicModalVisible, setIsPanicModalVisible }}>
      {children}
    </PanicModalContext.Provider>
  );
};

export const usePanicModal = () => {
  const context = useContext(PanicModalContext);
  if (context === undefined) {
    throw new Error('usePanicModal must be used within a PanicModalProvider');
  }
  return context;
}; 
import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type NavigationGuardHandler = {
  shouldBlock: () => boolean;
  onAttemptNavigate: (path: string) => void;
};

type NavigationGuardContextValue = {
  register: (handler: NavigationGuardHandler | null) => void;
  attemptNavigate: (path: string) => void;
};

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

export const NavigationGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const handlerRef = useRef<NavigationGuardHandler | null>(null);

  const register = useCallback((handler: NavigationGuardHandler | null) => {
    handlerRef.current = handler;
  }, []);

  const attemptNavigate = useCallback((path: string) => {
    const handler = handlerRef.current;
    if (handler?.shouldBlock()) {
      handler.onAttemptNavigate(path);
      return;
    }
    navigate(path);
  }, [navigate]);

  return (
    <NavigationGuardContext.Provider value={{ register, attemptNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
};

export const useNavigationGuard = () => useContext(NavigationGuardContext);

// src/store/contexts/RefreshContext.tsx
import React, {createContext, FC, ReactNode, useContext} from 'react';
import {RefreshType, refreshService} from '../../utils/refreshService';

interface RefreshContextType {
  refreshUserProfile: typeof refreshService.refreshUserProfile;
  refreshQueries: typeof refreshService.refreshQueries;
  refreshAllData: typeof refreshService.refreshAllData;
  triggerGlobalRefresh: typeof refreshService.triggerGlobalRefresh;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: FC<{children: ReactNode}> = ({children}) => {
  return (
    <RefreshContext.Provider
      value={{
        refreshUserProfile:
          refreshService.refreshUserProfile.bind(refreshService),
        refreshQueries: refreshService.refreshQueries.bind(refreshService),
        refreshAllData: refreshService.refreshAllData.bind(refreshService),
        triggerGlobalRefresh:
          refreshService.triggerGlobalRefresh.bind(refreshService),
      }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefreshContext must be used within a RefreshProvider');
  }
  return context;
};

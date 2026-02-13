import { createContext, useContext } from 'react';
import { GroupsTableDrilldownState, useDrilldownManager } from './hooks/useDrilldownManager';

type DrilldownManager<State extends GroupsTableDrilldownState> = ReturnType<
  typeof useDrilldownManager<State>
>;

const GroupsTableContext = createContext<DrilldownManager<GroupsTableDrilldownState> | null>(null);

interface GroupsTableContextProviderProps<State extends GroupsTableDrilldownState> {
  children: React.ReactNode;
  drilldownManager: DrilldownManager<State>;
}

export const GroupsTableContextProvider = <State extends GroupsTableDrilldownState>({
  children,
  drilldownManager,
}: GroupsTableContextProviderProps<State>) => {
  return (
    <GroupsTableContext.Provider
      value={drilldownManager as unknown as DrilldownManager<GroupsTableDrilldownState>}
    >
      {children}
    </GroupsTableContext.Provider>
  );
};

export const useGroupsTableContext = <State extends GroupsTableDrilldownState>() => {
  const context = useContext(GroupsTableContext);
  if (!context) {
    throw new Error('useGroupsTableContext must be used within a GroupsTableContextProvider');
  }
  return context as unknown as DrilldownManager<State>;
};

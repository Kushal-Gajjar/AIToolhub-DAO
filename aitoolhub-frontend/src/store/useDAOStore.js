import { create } from 'zustand';

export const useDAOStore = create((set) => ({
  proposals: [],
  tools: [],
  treasuryBalance: 0,
  setProposals: (proposals) => set({ proposals }),
  setTools: (tools) => set({ tools }),
  setTreasuryBalance: (balance) => set({ treasuryBalance: balance }),
}));

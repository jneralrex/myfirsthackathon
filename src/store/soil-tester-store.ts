import { create } from 'zustand';
import { SoilTester } from '../types/soil-tester';

interface SoilTesterState {
  soilTesters: SoilTester[];
  addSoilTester: (tester: Omit<SoilTester, 'id'>) => void;
  updateSoilTester: (id: string, status: SoilTester['status']) => void;
}

export const useSoilTesterStore = create<SoilTesterState>((set) => ({
  soilTesters: [],
  addSoilTester: (tester) => {
    set((state) => ({
      soilTesters: [
        ...state.soilTesters,
        {
          ...tester,
          id: Math.random().toString(36).substring(7),
        },
      ],
    }));
  },
  updateSoilTester: (id, status) => {
    set((state) => ({
      soilTesters: state.soilTesters.map((tester) =>
        tester.id === id ? { ...tester, status } : tester
      ),
    }));
  },
}));
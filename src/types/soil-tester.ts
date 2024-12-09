export interface SoilTester {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastReading: {
    ph: number;
    moisture: number;
    temperature: number;
    timestamp: string;
  };
}
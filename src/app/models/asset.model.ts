export interface Asset {
  id: string;
  name: string;
  type: 'physical' | 'non-physical';
  category: string;
  purchaseDate: string; // YYYY-MM-DD
  purchaseValue: number; // in USD
  residualValue: number; // in USD
  usefulLife: number; // in years
  serialNumber?: string;
  location?: string;
}

export type Currency = 'USD' | 'EUR' | 'ARS';

export interface DepreciationPoint {
  year: number;
  remainingValue: number;
  accumulatedDepreciation: number;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'Corporate HQ Server Rack',
    type: 'physical',
    category: 'Hardware',
    purchaseDate: '2023-01-15',
    purchaseValue: 12000,
    residualValue: 2000,
    usefulLife: 5,
    serialNumber: 'SR-99281',
    location: 'Data Center A'
  },
  {
    id: '2',
    name: 'Office Ergonomic Chairs',
    type: 'physical',
    category: 'Furniture',
    purchaseDate: '2024-03-01',
    purchaseValue: 4500,
    residualValue: 500,
    usefulLife: 7,
    location: 'Main Office - 3rd Floor'
  },
  {
    id: '3',
    name: 'Delivery Van',
    type: 'physical',
    category: 'Vehicles',
    purchaseDate: '2022-07-20',
    purchaseValue: 35000,
    residualValue: 7000,
    usefulLife: 10,
    serialNumber: 'VAN-2024-X',
    location: 'Warehouse South'
  },
  {
    id: '4',
    name: 'Enterprise ERP License',
    type: 'non-physical',
    category: 'Software',
    purchaseDate: '2025-01-10',
    purchaseValue: 15000,
    residualValue: 0,
    usefulLife: 3
  },
  {
    id: '5',
    name: 'Patent for Eco-Engine',
    type: 'non-physical',
    category: 'Intellectual Property',
    purchaseDate: '2021-05-18',
    purchaseValue: 50000,
    residualValue: 10000,
    usefulLife: 20
  },
  {
    id: '6',
    name: 'Cloud Platform Subscription',
    type: 'non-physical',
    category: 'Software',
    purchaseDate: '2025-06-01',
    purchaseValue: 8000,
    residualValue: 0,
    usefulLife: 2
  }
];

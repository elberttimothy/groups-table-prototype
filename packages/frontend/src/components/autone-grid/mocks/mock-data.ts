import { faker } from '@faker-js/faker';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'discontinued' | 'out_of_stock';
  supplier: string;
  warehouse: string;
  weight: number;
  rating: number;
  lastUpdated: Date;
}

faker.seed(42);

const generateProduct = (): Product => ({
  id: faker.string.uuid(),
  sku: faker.string.alphanumeric(8).toUpperCase(),
  name: faker.commerce.productName(),
  category: faker.commerce.department(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
  stock: faker.number.int({ min: 0, max: 1000 }),
  status: faker.helpers.arrayElement([
    'active',
    'discontinued',
    'out_of_stock',
  ]),
  supplier: faker.company.name(),
  warehouse: faker.location.city(),
  weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
  rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
  lastUpdated: new Date('2026-01-20T00:00:00.000Z'),
});

export const mockProducts: Product[] = Array.from(
  { length: 500 },
  generateProduct,
);

import { faker } from '@faker-js/faker';

export interface VariableProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  stock: number;
  status: 'active' | 'discontinued' | 'out_of_stock';
  notes: string;
  supplier: string;
}

faker.seed(99);

const generateVariableProduct = (): VariableProduct => {
  // Generate variable length descriptions
  const descriptionLength = faker.number.int({ min: 1, max: 4 });
  const description = faker.lorem.sentences(descriptionLength);

  // Generate variable number of tags
  const tagCount = faker.number.int({ min: 1, max: 5 });
  const tags = Array.from({ length: tagCount }, () => faker.commerce.productAdjective());

  // Generate variable length notes (some empty, some long)
  const hasNotes = faker.datatype.boolean();
  const notes = hasNotes ? faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })) : '';

  // Generate variable length product names
  const nameVariant = faker.number.int({ min: 0, max: 2 });
  let name: string;
  if (nameVariant === 0) {
    name = faker.commerce.productName();
  } else if (nameVariant === 1) {
    name = `${faker.commerce.productAdjective()} ${faker.commerce.productName()} - ${faker.commerce.productMaterial()}`;
  } else {
    name = `${faker.commerce.productName()} (${faker.commerce.productAdjective()}, ${faker.commerce.productAdjective()})`;
  }

  return {
    id: faker.string.uuid(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    name,
    description,
    category: faker.commerce.department(),
    tags,
    price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    stock: faker.number.int({ min: 0, max: 1000 }),
    status: faker.helpers.arrayElement(['active', 'discontinued', 'out_of_stock']),
    notes,
    supplier: faker.company.name(),
  };
};

export const variableMockProducts: VariableProduct[] = Array.from(
  { length: 500 },
  generateVariableProduct
);

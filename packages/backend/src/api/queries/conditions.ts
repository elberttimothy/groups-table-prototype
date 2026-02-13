import { Prisma } from '../../generated/prisma/client';
import { SkuLocationBody } from '../schemas';

const createConditionClause = (alias: string, attributeName: string, ids: string[]) =>
  `${alias}.${attributeName} IN (${ids.map((id) => `'${id}'`).join(',')})`;

const PRODUCT_FILTER_KEYS = [
  'sku_id',
  'product_id',
  'department_id',
  'sub_department_id',
  'style_id',
  'season_id',
  'gender_id',
  'product_group',
] as const;

const LOCATION_FILTER_KEYS = [
  'location_id',
  'country_id',
  'location_type_id',
  'region_id',
  'location_group',
] as const;

export const createConditions = (filters: SkuLocationBody['filters']) => {
  const conditions = ['TRUE'];
  if (!filters) return Prisma.raw(conditions.join(' AND '));

  // Process product filters
  for (const key of PRODUCT_FILTER_KEYS) {
    const value = filters[key];
    if (!value) continue;
    const ids = value.filter((id): id is string => id !== null);
    if (ids.length === 0) continue;
    conditions.push(
      createConditionClause(
        key === 'product_group' ? 'pgm' : 'sl',
        key === 'product_group' ? 'name' : key,
        ids
      )
    );
  }

  // Process location filters
  for (const key of LOCATION_FILTER_KEYS) {
    const value = filters[key];
    if (!value) continue;
    const ids = value.filter((id): id is string => id !== null);
    if (ids.length === 0) continue;
    conditions.push(
      createConditionClause(
        key === 'location_group' ? 'lgm' : 'sl',
        key === 'location_group' ? 'name' : key,
        ids
      )
    );
  }

  return Prisma.raw(conditions.join(' AND '));
};

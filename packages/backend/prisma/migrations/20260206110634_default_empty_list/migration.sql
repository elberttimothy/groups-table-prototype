-- AlterTable
ALTER TABLE "sku_locations" ALTER COLUMN "product_groups" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "location_groups" SET DEFAULT ARRAY[]::TEXT[];

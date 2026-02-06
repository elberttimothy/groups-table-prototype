/*
  Warnings:

  - You are about to drop the `SkuLocationMetric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SkuLocationMetric" DROP CONSTRAINT "SkuLocationMetric_sku_id_location_id_fkey";

-- DropTable
DROP TABLE "SkuLocationMetric";

-- CreateTable
CREATE TABLE "sku_location_metrics" (
    "sku_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "sales_l30d" INTEGER NOT NULL,
    "sales_l60d" INTEGER NOT NULL,
    "sales_l90d" INTEGER NOT NULL,
    "inventory" INTEGER NOT NULL,
    "pending_from_production" INTEGER NOT NULL,
    "recommended_ia" INTEGER NOT NULL,
    "unconstrained_ia" INTEGER NOT NULL,
    "user_ia" INTEGER,
    "assortment_recommendation" BOOLEAN NOT NULL,
    "assorted" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "sku_location_metrics_sku_id_location_id_key" ON "sku_location_metrics"("sku_id", "location_id");

-- AddForeignKey
ALTER TABLE "sku_location_metrics" ADD CONSTRAINT "sku_location_metrics_sku_id_location_id_fkey" FOREIGN KEY ("sku_id", "location_id") REFERENCES "sku_locations"("sku_id", "location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

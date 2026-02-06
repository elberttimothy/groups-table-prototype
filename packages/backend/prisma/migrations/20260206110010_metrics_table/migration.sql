-- CreateTable
CREATE TABLE "SkuLocationMetric" (
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
CREATE UNIQUE INDEX "SkuLocationMetric_sku_id_location_id_key" ON "SkuLocationMetric"("sku_id", "location_id");

-- AddForeignKey
ALTER TABLE "SkuLocationMetric" ADD CONSTRAINT "SkuLocationMetric_sku_id_location_id_fkey" FOREIGN KEY ("sku_id", "location_id") REFERENCES "sku_locations"("sku_id", "location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

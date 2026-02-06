-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_locations" (
    "sku_id" TEXT NOT NULL,
    "size_id" TEXT,
    "product_id" TEXT,
    "department_id" TEXT,
    "department_desc" TEXT,
    "sub_department_id" TEXT,
    "sub_department_desc" TEXT,
    "style_id" TEXT,
    "style_desc" TEXT,
    "season_id" TEXT,
    "season_desc" TEXT,
    "gender_id" TEXT,
    "gender_desc" TEXT,
    "product_groups" TEXT[],
    "location_id" TEXT NOT NULL,
    "location_desc" TEXT,
    "country_id" TEXT,
    "country_desc" TEXT,
    "location_type_id" TEXT,
    "location_type_desc" TEXT,
    "region_id" TEXT,
    "region_desc" TEXT,
    "location_groups" TEXT[],

    CONSTRAINT "sku_locations_pkey" PRIMARY KEY ("sku_id","location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

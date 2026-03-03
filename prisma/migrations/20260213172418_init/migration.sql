-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'agent');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('house', 'apartment', 'villa', 'commercial', 'land');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('For Sale', 'For Rent');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('draft', 'publish');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatar_url" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'draft',
    "property_status" "PropertyStatus" NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area" DECIMAL(10,2) NOT NULL,
    "area_unit" VARCHAR(20) NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "images" TEXT[],
    "featured_image_index" INTEGER,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "zip_code" VARCHAR(20) NOT NULL,
    "garage_spaces" INTEGER,
    "amenities" JSONB,
    "user_id" UUID,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_properties_user_id" ON "properties"("user_id");

-- CreateIndex
CREATE INDEX "idx_properties_property_type" ON "properties"("property_type");

-- CreateIndex
CREATE INDEX "idx_properties_status" ON "properties"("property_status");

-- CreateIndex
CREATE INDEX "idx_properties_location" ON "properties"("location");

-- CreateIndex
CREATE INDEX "idx_favorites_user_id" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "idx_favorites_property_id" ON "favorites"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_property_id_key" ON "favorites"("user_id", "property_id");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[picture]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[website]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rating` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingsCount` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "ratingsCount" INTEGER NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Venue_picture_key" ON "Venue"("picture");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_address_key" ON "Venue"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_phone_key" ON "Venue"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_website_key" ON "Venue"("website");

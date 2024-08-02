/*
  Warnings:

  - You are about to drop the column `slug` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Venue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Genre" ADD VALUE 'EDM';
ALTER TYPE "Genre" ADD VALUE 'POP';
ALTER TYPE "Genre" ADD VALUE 'FOLK';
ALTER TYPE "Genre" ADD VALUE 'REGGAE';
ALTER TYPE "Genre" ADD VALUE 'TECHNO';
ALTER TYPE "Genre" ADD VALUE 'HOUSE';
ALTER TYPE "Genre" ADD VALUE 'TRAP';
ALTER TYPE "Genre" ADD VALUE 'RANDB';

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Venue" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Owner_username_key" ON "Owner"("username");

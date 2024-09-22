/*
  Warnings:

  - You are about to drop the column `picture` on the `Party` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Party" DROP COLUMN "picture",
ADD COLUMN     "media" TEXT[];

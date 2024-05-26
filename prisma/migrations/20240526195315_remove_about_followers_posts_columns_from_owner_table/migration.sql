/*
  Warnings:

  - You are about to drop the column `about` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `followers` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `posts` on the `Owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "about",
DROP COLUMN "followers",
DROP COLUMN "posts";

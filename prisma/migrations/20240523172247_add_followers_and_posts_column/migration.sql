-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "posts" INTEGER NOT NULL DEFAULT 0;
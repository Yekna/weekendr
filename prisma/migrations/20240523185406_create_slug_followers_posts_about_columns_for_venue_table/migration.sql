-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "about" TEXT,
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "posts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT;
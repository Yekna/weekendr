-- DropIndex
DROP INDEX "Venue_ownerId_key";

-- AlterTable
ALTER TABLE "Venue" ALTER COLUMN "phone" DROP NOT NULL;

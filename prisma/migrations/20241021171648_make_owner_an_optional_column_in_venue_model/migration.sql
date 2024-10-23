-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_ownerId_fkey";

-- AlterTable
ALTER TABLE "Venue" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

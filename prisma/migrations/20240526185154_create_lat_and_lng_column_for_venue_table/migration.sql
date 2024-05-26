-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "venue_location" ON "Venue"("lat", "lng");

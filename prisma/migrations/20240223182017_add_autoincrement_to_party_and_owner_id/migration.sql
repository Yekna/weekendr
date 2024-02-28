-- AlterTable
CREATE SEQUENCE owner_id_seq;
ALTER TABLE "Owner" ALTER COLUMN "id" SET DEFAULT nextval('owner_id_seq');
ALTER SEQUENCE owner_id_seq OWNED BY "Owner"."id";

-- AlterTable
CREATE SEQUENCE party_id_seq;
ALTER TABLE "Party" ALTER COLUMN "id" SET DEFAULT nextval('party_id_seq');
ALTER SEQUENCE party_id_seq OWNED BY "Party"."id";

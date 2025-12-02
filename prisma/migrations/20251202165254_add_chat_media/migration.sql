-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mediaType" "MediaType",
ADD COLUMN     "mediaUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

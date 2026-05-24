-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "prodi" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'LOCAL';

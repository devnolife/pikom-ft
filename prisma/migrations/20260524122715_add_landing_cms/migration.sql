-- CreateEnum
CREATE TYPE "LandingProkerStatus" AS ENUM ('TERLAKSANA', 'DIRENCANAKAN');

-- CreateEnum
CREATE TYPE "LandingMemberRole" AS ENUM ('ANGGOTA');

-- CreateTable
CREATE TABLE "LandingContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "groupName" TEXT NOT NULL DEFAULT 'Umum',
    "label" TEXT,
    "multiline" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingPimpinan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT,
    "nama" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPimpinan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingBidang" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Sparkles',
    "desc" TEXT NOT NULL,
    "ketua" TEXT,
    "sekretaris" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingBidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingBidangAnggota" (
    "id" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LandingBidangAnggota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingProker" (
    "id" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "LandingProkerStatus" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LandingProker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingPeriode" (
    "id" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "ketua" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPeriode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingContent_key_key" ON "LandingContent"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPimpinan_slug_key" ON "LandingPimpinan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LandingBidang_slug_key" ON "LandingBidang"("slug");

-- AddForeignKey
ALTER TABLE "LandingBidangAnggota" ADD CONSTRAINT "LandingBidangAnggota_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "LandingBidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingProker" ADD CONSTRAINT "LandingProker_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "LandingBidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

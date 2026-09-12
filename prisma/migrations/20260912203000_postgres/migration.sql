-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Administrator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "askingPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "vatIncluded" BOOLEAN NOT NULL DEFAULT false,
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "country" TEXT,
    "condition" TEXT,
    "availability" TEXT,
    "stockNumber" TEXT,
    "serialNumber" TEXT,
    "description" TEXT,
    "sellerInfo" TEXT,
    "additionalInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "hours" INTEGER,
    "kilometres" INTEGER,
    "fuelType" TEXT,
    "transmission" TEXT,
    "enginePower" TEXT,
    "excavatorSpecs" JSONB,
    "truckSpecs" JSONB,
    "otherSpecs" JSONB,
    "videoUrl" TEXT,
    "youtubeUrl" TEXT,
    "vimeoUrl" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "purchaseCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "purchaseDate" TIMESTAMP(3),
    "supplier" TEXT,
    "purchaseLocation" TEXT,
    "transportCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repairCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherPurchaseCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "actualSellingPrice" DOUBLE PRECISION,
    "sellingCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "saleDate" TIMESTAMP(3),
    "buyer" TEXT,
    "sellingCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherSaleCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saleNotes" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'pdf',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "machineId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "contentEn" TEXT,
    "contentFi" TEXT,
    "contentSv" TEXT,
    "contentSq" TEXT,
    "contentDe" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_slug_key" ON "Machine"("slug");

-- CreateIndex
CREATE INDEX "Machine_category_status_idx" ON "Machine"("category", "status");

-- CreateIndex
CREATE INDEX "Machine_manufacturer_idx" ON "Machine"("manufacturer");

-- CreateIndex
CREATE INDEX "Machine_createdAt_idx" ON "Machine"("createdAt");

-- CreateIndex
CREATE INDEX "Machine_status_idx" ON "Machine"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_key_key" ON "PageContent"("key");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

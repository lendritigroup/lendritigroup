-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Administrator',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "askingPrice" REAL,
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
    "purchasePrice" REAL,
    "purchaseCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "purchaseDate" DATETIME,
    "supplier" TEXT,
    "purchaseLocation" TEXT,
    "transportCost" REAL NOT NULL DEFAULT 0,
    "repairCost" REAL NOT NULL DEFAULT 0,
    "otherPurchaseCosts" REAL NOT NULL DEFAULT 0,
    "actualSellingPrice" REAL,
    "sellingCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "saleDate" DATETIME,
    "buyer" TEXT,
    "sellingCosts" REAL NOT NULL DEFAULT 0,
    "otherSaleCosts" REAL NOT NULL DEFAULT 0,
    "saleNotes" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "machineId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "machineId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'pdf',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "machineId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "contentEn" TEXT,
    "contentFi" TEXT,
    "contentSv" TEXT,
    "contentSq" TEXT,
    "contentDe" TEXT,
    "updatedAt" DATETIME NOT NULL
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

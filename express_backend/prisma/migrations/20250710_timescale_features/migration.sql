-- CreateEnum
CREATE TYPE "TagValueType" AS ENUM ('bool', 'int', 'double');

-- CreateEnum
CREATE TYPE "FillEventType" AS ENUM ('manualUpload', 'estimate', 'scadaBackfill');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoObjectKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillEvent" (
    "id" TEXT NOT NULL,
    "type" "FillEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rolledBackAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "FillEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityCollectionEvent" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "recordedAtLocal" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fillEventId" TEXT,

    CONSTRAINT "FacilityCollectionEvent_pkey" PRIMARY KEY ("id","facilityId")
);

-- CreateTable
CREATE TABLE "TagValue" (
    "facilityId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "recordedAtLocal" TIMESTAMP NOT NULL,
    "valueType" "TagValueType" NOT NULL,
    "valueDouble" DOUBLE PRECISION,
    "valueInt" INTEGER,
    "valueBool" BOOLEAN,

    CONSTRAINT "TagValue_pkey" PRIMARY KEY ("facilityId","tagName","recordedAt")
);

-- CreateIndex
CREATE INDEX "TagValue_facilityId_recordedAt_idx" ON "TagValue"("facilityId", "recordedAt");

-- CreateIndex
CREATE INDEX "TagValue_facilityId_eventId_idx" ON "TagValue"("facilityId", "eventId");

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityCollectionEvent" ADD CONSTRAINT "FacilityCollectionEvent_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityCollectionEvent" ADD CONSTRAINT "FacilityCollectionEvent_fillEventId_fkey" FOREIGN KEY ("fillEventId") REFERENCES "FillEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagValue" ADD CONSTRAINT "TagValue_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagValue" ADD CONSTRAINT "TagValue_facilityId_eventId_fkey" FOREIGN KEY ("facilityId", "eventId") REFERENCES "FacilityCollectionEvent"("facilityId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable(
         '"TagValue"',                     -- table name *quoted* (camel-case)
         'recordedAt',                     -- time column  (case-sensitive!)
         partitioning_column => 'facilityId',
         number_partitions   => 4,
         migrate_data        => TRUE,      -- pull in any existing rows
         if_not_exists       => TRUE
);

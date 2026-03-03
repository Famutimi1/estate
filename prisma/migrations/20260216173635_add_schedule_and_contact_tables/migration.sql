-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferred_date" VARCHAR(50) NOT NULL,
    "preferred_time" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "viewer_type" VARCHAR(50) NOT NULL,
    "message" TEXT,
    "property_id" UUID,
    "property_title" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "message" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'unread',

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_schedules_property_id" ON "schedules"("property_id");

-- CreateIndex
CREATE INDEX "idx_schedules_email" ON "schedules"("email");

-- CreateIndex
CREATE INDEX "idx_schedules_status" ON "schedules"("status");

-- CreateIndex
CREATE INDEX "idx_contacts_email" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "idx_contacts_status" ON "contacts"("status");

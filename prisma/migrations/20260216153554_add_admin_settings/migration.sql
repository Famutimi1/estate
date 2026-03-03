-- CreateTable
CREATE TABLE "admin_settings" (
    "id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "site_name" VARCHAR(255) NOT NULL,
    "site_description" TEXT NOT NULL,
    "contact_email" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(50) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "properties_per_page" INTEGER NOT NULL,
    "enable_registration" BOOLEAN NOT NULL DEFAULT true,
    "enable_favorites" BOOLEAN NOT NULL DEFAULT true,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "facebook_url" VARCHAR(255),
    "twitter_url" VARCHAR(255),
    "instagram_url" VARCHAR(255),
    "linkedin_url" VARCHAR(255),
    "youtube_url" VARCHAR(255),
    "meta_title" VARCHAR(255) NOT NULL,
    "meta_description" TEXT NOT NULL,
    "google_analytics_id" VARCHAR(50),

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

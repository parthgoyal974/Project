-- CreateTable
CREATE TABLE "sessions" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "password" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "code" STRING DEFAULT '',
    "language" STRING DEFAULT 'javascript',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

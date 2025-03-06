-- CreateTable
CREATE TABLE "Welcome" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SotdQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sotd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "role_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "role_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QotdQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Qotd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL
);

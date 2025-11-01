/*
  Warnings:

  - You are about to alter the column `content` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `name` on the `project_images` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `type` on the `project_images` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `userId` on the `projects` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `keywords` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `firstname` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `lastname` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nickname` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.
  - A unique constraint covering the columns `[projectId,userId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,projectId,userId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `project_images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,projectId]` on the table `project_images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,authorId]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_userId_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "content" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "project_images" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "published" TIMESTAMP(3),
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "keywords" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "firstname" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "lastname" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(60);

-- CreateTable
CREATE TABLE "authors" (
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_userId_key" ON "authors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comments_projectId_userId_key" ON "comments"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "comments_id_projectId_userId_key" ON "comments"("id", "projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_public_id_key" ON "project_images"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_name_projectId_key" ON "project_images"("name", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_authorId_key" ON "projects"("id", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

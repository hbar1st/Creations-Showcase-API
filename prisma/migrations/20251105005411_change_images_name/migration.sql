/*
  Warnings:

  - You are about to drop the `project_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."project_images" DROP CONSTRAINT "project_images_projectId_fkey";

-- DropTable
DROP TABLE "public"."project_images";

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "public_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_public_id_key" ON "images"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_name_projectId_key" ON "images"("name", "projectId");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

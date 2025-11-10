/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_projectId_userId_key" ON "likes"("projectId", "userId");

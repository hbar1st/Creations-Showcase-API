import prisma from "../middleware/prisma.mjs"

export async function deleteUsers() {
  const deletedUsers = await prisma.user.deleteMany();
  return deletedUsers;
}
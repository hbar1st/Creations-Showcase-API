const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "error", // Log only errors to stdout
    },
    {
      emit: "stdout",
      level: "query", // Log database queries
    },
  ],
  errorFormat: "pretty",
});
module.exports = prisma;

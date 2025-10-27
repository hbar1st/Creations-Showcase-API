const { PrismaClient } = require("../generated/prisma/client");
const prisma = require("../middleware/prisma.mjs");

// run inside `async` function
async function addNewUser(firstname, lastname, nickname, email, password) {
  const newUser = await prisma.default.user.create({
    data: {
      firstname,
      lastname,
      nickname,
      email,
      password,
    }
  });
  return newUser;
}

async function findUser(email) {
  console.log("in findUser: ", email);  
  const user = await prisma.default.user.findFirst({
    where: {
      email,
    },
  });
  console.log("rows found: ", user);
  return user;
}

async function findUserById(id) {
  console.log("in findUserById: ", id);
  // By unique identifier
  const user = await prisma.default.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  console.log("return user: ", user);
  return user;
}

async function findUserByEmail(email) {
  console.log("in findUserByEmail: ", email);
  // By unique identifier
  const user = await prisma.default.user.findFirst({
    where: {
      email,
    },
  });
  console.log("return user: ", user);
  return user;
}

async function deleteUser(id) {
  console.log("in deleteUser: ", id);
  const user = await prisma.default.user.delete({
    where: {
      id: Number(id)
    }
  })
  return user;
}

// values should be an object of key-value pairs that match with the users table
async function updateUser(id, values) {
  console.log("in updateUser:", values);
  const user = await prisma.default.user.update({
    where: {
      id: Number(id)
    },
    data: values
  })
  return user;
}

module.exports = {
  addNewUser,
  findUser,
  findUserById,
  findUserByEmail,
  deleteUser,
  updateUser,
};

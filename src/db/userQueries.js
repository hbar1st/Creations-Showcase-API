//const { PrismaClient } = require("../generated/prisma/client");
const prisma = require("../middleware/prisma.mjs");


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

/**
 * Will include a field to reflect if the user is also an author or not
 * @param {*} id 
 * @returns 
 */
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

/**
 * looks for another user with the same email
 * @param {} id 
 * @returns 
 */
async function findOtherUser(id, email) {
  console.log("in findOtherUser: ", id, email)
  const user = await prisma.default.user.findFirst({
    where: {
      AND: [
        { email },
        {
          id: {
            not: Number(id)
          }
        }
      ]
    }
  })
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
  
  findOtherUser,
  findUserById,
  findUserByEmail,
  deleteUser,
  updateUser,
};

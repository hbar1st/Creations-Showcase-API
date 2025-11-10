const {
  updateProjectLikes,
  removeProjectLike,
} = require("../db/interactionsQueries");

const AppError = require("../errors/AppError");

// addLike will add a like if there isn't one already there. If there is one there, it does nothing.
async function addLike(req,res,next) {
  console.log("in addLike:", req.user.id, req.params.pid)
  const userId = Number(req.user.id);
  const pid = req.params.pid;
  try {
    const like = await updateProjectLikes(pid, userId);
    if (like) {
      res.status(200).json({ status: "success", result: like });
    } else {
      throw new AppError("Failed to add a like to the project")
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  } 
}

async function removeLike(req, res, next) {
  console.log("in removeLike: ", req.user.id, req.params.pid)
  const userId = Number(req.user.id);
  const pid = req.params.pid;
  try {
    const removedLike = await removeProjectLike(pid, userId);
    if (removedLike) {
      res.status(200).json({ status: "success", result: {} });
    } else {
      throw new AppError("Failed to remove a like from the project");
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  } 
}
module.exports = {
  addLike,
  removeLike,
}
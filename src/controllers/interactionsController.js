const {
  updateProjectLikes,
  removeProjectLike,
  addOrUpdateComment,
  deleteComment
} = require("../db/interactionsQueries");

const AppError = require("../errors/AppError");

async function addComment(req, res) {
  console.log("in addComment: ", req.user.id, req.body.comment);
  const userId = req.user.id;
  const projectId = req.params.pid;
  const content = req.body.comment;

  try {
    const comment = await addOrUpdateComment(userId, projectId, content);
    if (comment) {
      res.status(200).json({ status: "success", result: comment})
    } else {
      throw new AppError("Failed to add a comment to the project")
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}

async function updateComment(req, res) {
  console.log("in updateComment: ", req.user.id, req.body.comment);
  const userId = req.user.id;
  const projectId = req.params.pid;
  const content = req.body.comment;

  try {
    const comment = await addOrUpdateComment(userId, projectId, content);
    if (comment) {
      res.status(200).json({ status: "success", result: comment });
    } else {
      throw new AppError("Failed to update a comment to the project");
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}

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
      res.status(200).json({ status: "success", result: removedLike });
    } else {
      throw new AppError("Failed to remove a like from the project");
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  } 
}

async function removeComment(req, res, next) {
  console.log("in removeComment: ", req.user.id, req.params.pid);
  const userId = Number(req.user.id);
  const pid = Number(req.params.pid);
  try {
    const removedComment = await deleteComment(userId, pid);
    if (removedComment) {
      res.status(200).json({ status: "success", result: removedComment });
    } else {
      throw new AppError("Failed to remove a comment from the project");
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}
module.exports = {
  addLike,
  removeLike,
  addComment,
  updateComment,
  removeComment,
}
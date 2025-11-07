const {
  getProjectsByUser,
  addNewProject,
  deleteProject: dbDeleteProject,
  deleteProjectImage: dbDeleteProjectImage,
  upsertImage,
  getProjectImage,
  getProjectImages,
  getProjectById,
} = require("../db/projectQueries");

const AppError = require("../errors/AppError");

const { unlink } = require("node:fs/promises");

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: Math.floor(10 * 1024 * 1024), // value of 10MB transferred to bytes
    files: 1,
  },
});

async function getProjectDetails(req, res) {
  console.log("in getProjectDetails: ", req.params.pid);
  const user = req.user;
  const pid = req.params.pid;
  let project;
  try {
    if (user) {
      // if we have the user info, we need to get the project whose user is this one
      project = await getProjectsByAuthor(user.id, pid);
      if (project) {
        res.status(200).json({ status: "success", result: project })
      } else {
        throw new AppError("Failed to access the project", 500);
      }
    } else {
      // otherwise just get the first project that matches the pid
      project = await getProjectById(pid);
    }
    if (project){
      res.status(200).json({ status: "success", result: project })
    } else {
      throw new AppError("Failed to get the project")
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}

async function getUserProjects(req, res) {
  console.log("in getUserProjects");
  const user = req.user;
  if (user) {
    try {
      const projects = await getProjectsByUser(user.id);
      if (projects) {
        res.status(200).json({ status: "success", result: projects });
      } else {
        throw new AppError("Failed to access user's projects", 500);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw error;
    }
  } else {
    throw new AppError("Failed to get the user record", 500);
  }
}

async function addProject(req, res) {
  console.log("in addNewProject: ", req.body);
  const user = req.user;
  if (!user) {
    throw new AppError("Failed to get the user record", 500);
  }
  // TODO fill the logic in to add a new project
  // start by adding the plain project then add code to add the featured image too
  try {
    const project = await addNewProject(user.id, req.body);
    if (project) {
      res.status(200).json({ status: "success", result: project });
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}

function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("image")(req, res, (err) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
}

async function addImageToProject(req, res, next) {
  const projectId = req.params.pid;
  
  const file = await runMulter(req, res);
  
  console.log("in uploadFile: ", file, req.body);
  console.log("file mimetype: ", file.mimetype);
  
  if (!file.mimetype.startsWith("image")) {
    await deleteFileFromMemory(file.path);
    throw new AppError("Wrong file type. Only images are accepted.", 400);
  }
  if (file.size > 10 * 1024 * 1024) {
    await deleteFileFromMemory(file.path);
    throw new AppError("Image files should not exceed 10MB.", 413);
  }
  
  const { originalname } = file;
  
  console.log("file details from multer: ", file);
  
  const options = {
    use_filename: true,
    overwrite: true,
    unique_filename: true,
    resource_type: "image",
    folder: "TOP-creations-showcase-app",
  };
  
  // determine if this project already has a featured image and replace it if so in cloudinary by setting its public_id in the options object
  const imageRow = await getProjectImage(projectId);
  if (imageRow) {
    options.public_id = imageRow.public_id.split("/")[1];
  }
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
    .upload_stream(options, (error, uploadResult) => {
      if (error) {
        return reject(error);
      }
      return resolve(uploadResult);
    })
    .end(file.buffer);
  });
  
  try {
    if (!uploadResult) {
      throw new AppError("Cloudinary upload failed. Please check logs.");
    }
    console.log("cloudinary upload succeeded: ", uploadResult);
    
    //const dbCommand = imageRow ? updateImage : addNewImage;
    
    const newImageRow = await upsertImage(
      projectId,
      originalname,
      uploadResult.public_id,
      uploadResult.resource_type,
      uploadResult.secure_url
    );
    
    if (newImageRow) {
      res.status(200).json({ status: "success", url: newImageRow.url });
    } else {
      throw new AppError("Unexpected error: failed to add the image");
    }
  } catch (error) {
    console.log("in uploadFile: found an error during upload?", error);
    if (uploadResult) {
      // clean up the file from cloudinary since we failed to store a record of it in postgresql
      const result = await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log(result);
    }
    console.error(error, error.stack);
    throw error;
  }
}

async function deleteFileFromMemory(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error(
      "there was an error deleting a file from memory:",
      error.message
    );
    throw new AppError("Unexpected error.", 500, error);
  }
}
async function deleteProjectImage(req, res) {
  console.log("in deleteProjectImage")
  const user = req.user;
  
  try {
    const deletedImage = await dbDeleteProjectImage(req.params.pid); 
    if (deletedImage) {

      // delete from Cloudinary too
      const result = await cloudinary.uploader.destroy(deletedImage.public_id);
      console.log(result);      
      res
      .status(200)
      .json({ status: "success", message: "Image delete complete." });
    } else {
      throw new AppError(
        "Failed to delete the image records. Contact support.",
        500
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to delete the project record", 500, error);
    }
  }
}
async function deleteProject(req, res) {
  console.log("in deleteProject")
  const user = req.user;
  
  try {
    // before deleting the project, delete the image(s) from cloudinary.
    const images = await getProjectImages(req.params.pid);
    console.log(images);
    if (images) {
      const deletedImage = await dbDeleteProjectImage(req.params.pid);
      if (!deletedImage) {
        throw new AppError("Failed to delete the project and related image file")
      }

      // delete from Cloudinary too
      images.forEach(async image => {
        const result = await cloudinary.uploader.destroy(image.public_id);
        console.log("Cloudinary delete result for public_id: ", image.public_id)
        console.log(result);
      });
    }
    const deletedProject = await dbDeleteProject(req.params.pid);
    if (deletedProject) {
      res
      .status(200)
      .json({ status: "success", message: "Project delete complete." });
    } else {
      throw new AppError(
        "Failed to delete the project records. Contact support.",
        500
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to delete the project record", 500, error);
    }
  }
}
module.exports = {
  getUserProjects,
  addProject,
  deleteProject,
  deleteProjectImage,
  addImageToProject,
  getProjectDetails,
};

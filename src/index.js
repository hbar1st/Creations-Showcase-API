const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { app } = require("./common/serverSetup")

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`)
  } else {
    console.error('Server startup error:', err)
  }
  process.exit(1) // Exit the process if a critical error occurs
})

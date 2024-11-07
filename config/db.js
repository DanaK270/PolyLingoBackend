// Load Dependency
const mongoose = require('mongoose')

//// TODO: we can uncomment it after creating the ////

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // console.log("MongoDB Connected");
    const db = mongoose.connection
    console.log(
      `MongoDB Connected to Database: ${db.name} at Host: ${db.host} on Port: ${db.port}`
    )
  })
  .catch((err) => {
    console.log('MongoDB not connected' + err)
  })

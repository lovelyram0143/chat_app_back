const { default: mongoose } = require("mongoose");

/**
 * The function `db_connect` attempts to connect to a MongoDB database using Mongoose and logs a
 * success message if the connection is successful.
 */
const db_connect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};
module.exports = { db_connect };

import mongoose from "mongoose";

module.exports = async function (globalConfig, projectConfig) {
  console.log('jest teardown test')
  await mongoose.connection.close();
  process.exit();
}

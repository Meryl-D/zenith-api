import User from "../database/models/userModel.js"

export const cleanUpDatabase = async function() {
    await Promise.all([
      User.deleteMany()
    ]);
  };
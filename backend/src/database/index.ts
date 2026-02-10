import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { seedAdmin } from "./seed";

export const initDatabase = async () => {
  await connectDatabase();

  // Always seed admin on first run (checks if exists first)
  await seedAdmin();
};

export const closeDatabase = async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
};

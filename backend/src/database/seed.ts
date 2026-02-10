import { User } from "../models";
import { UserRole, UserStatus } from "../types";
import { config } from "../config";

export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: config.admin.email,
    });

    if (existingAdmin) {
      console.log("✅ Super admin already exists");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    // Create super admin
    const admin = await User.create({
      email: config.admin.email,
      password: config.admin.password,
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    });

    console.log("🎉 Super admin created successfully!");
    console.log("=".repeat(50));
    console.log("   📧 Email: " + admin.email);
    console.log("   🔑 Password: " + config.admin.password);
    console.log("   👤 Role: SUPER_ADMIN");
    console.log("=".repeat(50));
    console.log("   ⚠️  IMPORTANT: Change credentials after first login!");
    console.log("   📝 Steps:");
    console.log("      1. Login with above credentials");
    console.log("      2. Create your organization");
    console.log("      3. Update email via PUT /api/auth/profile");
    console.log("      4. Change password via POST /api/auth/change-password");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
};

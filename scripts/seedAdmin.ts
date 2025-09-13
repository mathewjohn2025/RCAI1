/**
 * Admin User Seed Script
 * Creates admin user from environment variables (no hardcoding)
 */

import { db } from '../server/db.js';
import { users, roles, userRoles } from '../shared/schema.js';
import { hashPassword } from '../server/rbac-middleware.js';
import { eq } from 'drizzle-orm';

async function upsertAdmin(email: string, password: string, roleName: string = 'admin') {
  console.log(`[SEED] Creating admin user: ${email}`);
  
  try {
    // Ensure admin role exists
    let [adminRole] = await db.select().from(roles).where(eq(roles.name, roleName));
    if (!adminRole) {
      [adminRole] = await db.insert(roles).values({
        name: roleName,
        description: 'Administrator role with full access'
      }).returning();
      console.log(`[SEED] Created admin role: ${roleName}`);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    let userId: string;
    if (existingUser) {
      // Update existing user
      const [updatedUser] = await db.update(users)
        .set({ 
          passwordHash, 
          isActive: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, existingUser.id))
        .returning({ id: users.id });
      userId = updatedUser.id;
      console.log(`[SEED] Updated existing admin user: ${email}`);
    } else {
      // Create new user
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash,
        isActive: true,
      }).returning({ id: users.id });
      userId = newUser.id;
      console.log(`[SEED] Created new admin user: ${email}`);
    }

    // Ensure user has admin role
    const [existingUserRole] = await db.select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
    
    if (!existingUserRole) {
      await db.insert(userRoles).values({
        userId,
        roleId: adminRole.id
      });
      console.log(`[SEED] Assigned ${roleName} role to user`);
    }

    console.log(`[SEED] Admin user ready: ${email}`);
  } catch (error) {
    console.error('[SEED] Error creating admin user:', error);
    throw error;
  }
}

async function main() {
  const adminEmail = process.env.SETUP_ADMIN_EMAIL;
  const adminPassword = process.env.SETUP_ADMIN_PASSWORD;
  const roleName = process.env.ADMIN_ROLE_NAME || 'admin';

  if (!adminEmail || !adminPassword) {
    console.error('[SEED] SETUP_ADMIN_EMAIL and SETUP_ADMIN_PASSWORD environment variables are required');
    process.exit(1);
  }

  await upsertAdmin(adminEmail, adminPassword, roleName);
  console.log('[SEED] Admin seeding completed successfully');
  process.exit(0);
}

main().catch((error) => {
  console.error('[SEED] Failed to seed admin user:', error);
  process.exit(1);
});
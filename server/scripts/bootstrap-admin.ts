import { PrismaClient, Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error("Usage: npm run bootstrap:admin -- <email> <password>");
    console.error("Or provide ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
    process.exit(1);
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const account = await prisma.account.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: email.toLowerCase().trim(),
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Successfully bootstrapped administrator account: ${account.email} (Role: ${account.role})`);
}

bootstrapAdmin()
  .catch((e) => {
    console.error("Bootstrap admin failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function bootstrapParent() {
  const email = "parent@noor.local";
  const password = "ParentPassword123!";

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const parent = await prisma.account.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.PARENT,
    },
    create: {
      email,
      passwordHash,
      role: Role.PARENT,
    },
  });

  // Ensure 2 children exist for this parent
  const amina = await prisma.childProfile.upsert({
    where: { id: "child-amina-demo-id" },
    update: {
      nickname: "ആമിന (Amina)",
      ageBand: "10-11",
      preferredLanguage: "ml",
      parentAccountId: parent.id,
    },
    create: {
      id: "child-amina-demo-id",
      nickname: "ആമിന (Amina)",
      ageBand: "10-11",
      preferredLanguage: "ml",
      parentAccountId: parent.id,
    },
  });

  const zayd = await prisma.childProfile.upsert({
    where: { id: "child-zayd-demo-id" },
    update: {
      nickname: "സൈദ് (Zayd)",
      ageBand: "8-9",
      preferredLanguage: "ml",
      parentAccountId: parent.id,
    },
    create: {
      id: "child-zayd-demo-id",
      nickname: "സൈദ് (Zayd)",
      ageBand: "8-9",
      preferredLanguage: "ml",
      parentAccountId: parent.id,
    },
  });

  console.log(`Successfully bootstrapped parent: ${parent.email} with children: ${amina.nickname}, ${zayd.nickname}`);
}

bootstrapParent()
  .catch((e) => {
    console.error("Bootstrap parent failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

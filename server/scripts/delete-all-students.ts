import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllStudents() {
  console.log("Searching for student profiles...");
  const students = await prisma.childProfile.findMany({
    select: { id: true, nickname: true },
  });

  console.log(`Found ${students.length} student profiles in database.`);

  if (students.length === 0) {
    console.log("No student profiles to delete.");
    return;
  }

  // Delete dependencies first if any
  const studentIds = students.map((s) => s.id);
  console.log("Cleaning up related student records...");
  
  await prisma.rewardTransaction.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.badgeAward.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.cosmeticUnlock.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.reviewAttempt.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.reviewSchedule.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.objectiveMastery.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.missionCompletion.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.missionAttempt.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.familyReflection.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});
  await prisma.guardianConsentRecord.deleteMany({ where: { childProfileId: { in: studentIds } } }).catch(() => {});

  const res = await prisma.childProfile.deleteMany({
    where: { id: { in: studentIds } },
  });

  console.log(`Successfully deleted ${res.count} student profile(s) from database:`, students.map((s) => s.nickname));
}

deleteAllStudents()
  .catch((e) => {
    console.error("Error deleting students:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

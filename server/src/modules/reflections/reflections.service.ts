import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class ReflectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReflections(childProfileId: string) {
    return this.prisma.familyReflection.findMany({
      where: { childProfileId },
      orderBy: { createdAt: "desc" },
      include: {
        mission: {
          select: { id: true, titleMl: true, titleEn: true, conceptMl: true, conceptEn: true },
        },
      },
    });
  }

  async createReflection(childProfileId: string, missionId: string, note: string) {
    return this.prisma.familyReflection.create({
      data: {
        childProfileId,
        missionId,
        note: note.trim(),
      },
    });
  }

  async deleteReflection(childProfileId: string, reflectionId: string) {
    const existing = await this.prisma.familyReflection.findUnique({
      where: { id: reflectionId },
    });

    if (!existing || existing.childProfileId !== childProfileId) {
      throw new NotFoundException({
        errorCode: "REFLECTION_NOT_FOUND",
        message: "Family reflection not found.",
      });
    }

    await this.prisma.familyReflection.delete({
      where: { id: reflectionId },
    });

    return { success: true, message: "Reflection deleted successfully." };
  }
}

import { PrismaService } from "../../database/prisma.service";
export declare class ReflectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReflections(childProfileId: string): Promise<({
        mission: {
            id: string;
            titleMl: string;
            titleEn: string;
            conceptMl: string;
            conceptEn: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        childProfileId: string;
        missionId: string;
        note: string;
    })[]>;
    createReflection(childProfileId: string, missionId: string, note: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        childProfileId: string;
        missionId: string;
        note: string;
    }>;
    deleteReflection(childProfileId: string, reflectionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

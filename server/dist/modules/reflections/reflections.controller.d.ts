import { ReflectionsService } from "./reflections.service";
import { CreateReflectionDto } from "./dto/reflections.dto";
export declare class ReflectionsController {
    private readonly reflectionsService;
    constructor(reflectionsService: ReflectionsService);
    getReflections(childId: string): Promise<({
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
    createReflection(childId: string, dto: CreateReflectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        childProfileId: string;
        missionId: string;
        note: string;
    }>;
    deleteReflection(childId: string, reflectionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

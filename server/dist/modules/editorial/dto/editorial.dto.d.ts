export declare class CreateDraftDto {
    versionString: string;
    teachingJson: any;
    activitiesJson: any;
    checkpointPoolJson: any;
    revisionJson: any;
    familyPromptMl: string;
    familyPromptEn: string;
}
export declare class ReviewContentDto {
    status: "APPROVED" | "REJECTED";
    comments?: string;
}
export declare class PublishVersionDto {
    releaseNotes?: string;
}

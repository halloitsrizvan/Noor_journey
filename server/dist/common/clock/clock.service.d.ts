export declare class ClockService {
    private mockTime;
    now(): Date;
    setMockTime(date: Date | null): void;
    advanceDays(days: number): void;
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class ClockService {
  private mockTime: Date | null = null;

  /**
   * Returns current time (or mocked time in tests)
   */
  now(): Date {
    return this.mockTime ? new Date(this.mockTime.getTime()) : new Date();
  }

  /**
   * For testing only: set simulated clock time
   */
  setMockTime(date: Date | null): void {
    this.mockTime = date ? new Date(date.getTime()) : null;
  }

  /**
   * For testing only: advance mock clock by days
   */
  advanceDays(days: number): void {
    const current = this.now();
    this.mockTime = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

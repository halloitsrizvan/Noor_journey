import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "@/database/prisma.service";
import { Public } from "@/common/decorators/auth.decorators";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Health probe" })
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get("live")
  @ApiOperation({ summary: "Liveness probe" })
  getLiveness() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get("ready")
  @ApiOperation({ summary: "Readiness probe with bounded database connectivity check" })
  async getReadiness() {
    try {
      // Bounded 2-second timeout query
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database check timed out")), 2000)
      );
      const dbPromise = this.prisma.$queryRaw`SELECT 1`;

      await Promise.race([dbPromise, timeoutPromise]);

      return {
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new ServiceUnavailableException({
        errorCode: "DATABASE_UNAVAILABLE",
        message: "Database connectivity check failed.",
      });
    }
  }
}

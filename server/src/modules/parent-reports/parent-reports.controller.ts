import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { ParentReportsService } from "./parent-reports.service";
import { AuthGuard } from "@/common/guards/auth.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@ApiTags("Parent Reports")
@ApiCookieAuth()
@UseGuards(AuthGuard, ChildOwnershipGuard)
@Controller("children/:childId")
export class ParentReportsController {
  constructor(private readonly reportsService: ParentReportsService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get child learning summary report for parents" })
  async getChildSummary(@Param("childId") childId: string) {
    return this.reportsService.getChildSummary(childId);
  }
}

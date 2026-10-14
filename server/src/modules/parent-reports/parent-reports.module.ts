import { Module } from "@nestjs/common";
import { ParentReportsService } from "./parent-reports.service";
import { ParentReportsController } from "./parent-reports.controller";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [ParentReportsController],
  providers: [ParentReportsService, ChildOwnershipGuard],
  exports: [ParentReportsService],
})
export class ParentReportsModule {}

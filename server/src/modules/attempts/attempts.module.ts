import { Module } from "@nestjs/common";
import { AttemptsService } from "./attempts.service";
import { AttemptsController } from "./attempts.controller";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [AttemptsController],
  providers: [AttemptsService, ChildOwnershipGuard],
  exports: [AttemptsService],
})
export class AttemptsModule {}

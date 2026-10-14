import { Module } from "@nestjs/common";
import { ChildrenService } from "./children.service";
import { ChildrenController } from "./children.controller";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [ChildrenController],
  providers: [ChildrenService, ChildOwnershipGuard],
  exports: [ChildrenService, ChildOwnershipGuard],
})
export class ChildrenModule {}

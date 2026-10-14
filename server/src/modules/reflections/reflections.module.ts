import { Module } from "@nestjs/common";
import { ReflectionsService } from "./reflections.service";
import { ReflectionsController } from "./reflections.controller";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [ReflectionsController],
  providers: [ReflectionsService, ChildOwnershipGuard],
  exports: [ReflectionsService],
})
export class ReflectionsModule {}

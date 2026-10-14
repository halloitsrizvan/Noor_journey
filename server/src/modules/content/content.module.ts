import { Module } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [ContentController],
  providers: [ContentService, ChildOwnershipGuard],
  exports: [ContentService],
})
export class ContentModule {}

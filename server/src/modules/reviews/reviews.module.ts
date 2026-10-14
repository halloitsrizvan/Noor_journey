import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { RewardsService } from "@/modules/rewards/rewards.service";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, RewardsService, ChildOwnershipGuard],
  exports: [ReviewsService, RewardsService],
})
export class ReviewsModule {}

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { RewardsService } from "@/modules/rewards/rewards.service";
import { SubmitReviewAnswersDto, FinalizeReviewDto } from "./dto/reviews.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@ApiTags("Revision & Rewards")
@ApiCookieAuth()
@UseGuards(AuthGuard, ChildOwnershipGuard)
@Controller("children/:childId")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly rewardsService: RewardsService,
  ) {}

  @Get("reviews")
  @ApiOperation({ summary: "Get due spaced review missions for child" })
  async getDueReviews(@Param("childId") childId: string) {
    return this.reviewsService.getDueReviews(childId);
  }

  @Post("reviews/:reviewId/attempts")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Start spaced review attempt" })
  async createReviewAttempt(
    @Param("childId") childId: string,
    @Param("reviewId") reviewId: string,
  ) {
    return this.reviewsService.createReviewAttempt(childId, reviewId);
  }

  @Post("review-attempts/:attemptId/answers")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Submit answers for review attempt" })
  async submitReviewAnswers(
    @Param("attemptId") attemptId: string,
    @Body() dto: SubmitReviewAnswersDto,
  ) {
    return this.reviewsService.submitReviewAnswers(attemptId, dto.answers);
  }

  @Post("review-attempts/:attemptId/finalize")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Finalize review attempt, award 5 XP, and update spaced interval" })
  async finalizeReview(
    @Param("childId") childId: string,
    @Param("attemptId") attemptId: string,
    @Headers("idempotency-key") idempotencyHeader?: string,
    @Body() dto?: FinalizeReviewDto,
  ) {
    const key = idempotencyHeader || dto?.idempotencyKey;
    return this.reviewsService.finalizeReview(childId, attemptId, key);
  }

  @Get("progress")
  @ApiOperation({ summary: "Get child learning progress, XP, and weekly stats" })
  async getProgress(@Param("childId") childId: string) {
    return this.rewardsService.getProgress(childId);
  }

  @Get("collection")
  @ApiOperation({ summary: "Get earned badges and cosmetic avatar collection" })
  async getCollection(@Param("childId") childId: string) {
    return this.rewardsService.getCollection(childId);
  }
}

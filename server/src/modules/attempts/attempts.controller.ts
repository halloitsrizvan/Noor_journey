import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth, ApiHeader } from "@nestjs/swagger";
import { AttemptsService } from "./attempts.service";
import {
  CreateAttemptDto,
  SubmitActivityDto,
  SubmitCheckpointAnswerDto,
  FinalizeCheckpointDto,
} from "./dto/attempts.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@ApiTags("Learning Attempts & Grading")
@ApiCookieAuth()
@UseGuards(AuthGuard, ChildOwnershipGuard)
@Controller("children/:childId")
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post("missions/:missionId/attempts")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Start a mission attempt" })
  async createAttempt(
    @Param("childId") childId: string,
    @Param("missionId") missionId: string,
    @Body() dto: CreateAttemptDto,
  ) {
    return this.attemptsService.createAttempt(childId, missionId, dto.missionVersionId);
  }

  @Get("attempts/:attemptId")
  @ApiOperation({ summary: "Get mission attempt state" })
  async getAttempt(@Param("attemptId") attemptId: string) {
    return this.attemptsService.getAttempt(attemptId);
  }

  @Post("attempts/:attemptId/activities/:activityId/submissions")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Submit an activity for server-side evaluation" })
  async submitActivity(
    @Param("attemptId") attemptId: string,
    @Param("activityId") activityId: string,
    @Body() dto: SubmitActivityDto,
  ) {
    return this.attemptsService.submitActivity(attemptId, activityId, dto.payload);
  }

  @Post("attempts/:attemptId/checkpoints")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Start checkpoint for attempt" })
  async createCheckpoint(@Param("attemptId") attemptId: string) {
    return this.attemptsService.createCheckpoint(attemptId);
  }

  @Post("checkpoints/:checkpointId/answers")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Submit answer for checkpoint question" })
  async submitCheckpointAnswer(
    @Param("checkpointId") checkpointId: string,
    @Body() dto: SubmitCheckpointAnswerDto,
  ) {
    return this.attemptsService.submitCheckpointAnswer(
      checkpointId,
      dto.questionId,
      dto.choiceId,
    );
  }

  @Post("checkpoints/:checkpointId/finalize")
  @UseGuards(CsrfGuard)
  @ApiHeader({ name: "Idempotency-Key", required: false })
  @ApiOperation({ summary: "Finalize checkpoint atomically, granting XP and unlocks" })
  async finalizeCheckpoint(
    @Param("childId") childId: string,
    @Param("checkpointId") checkpointId: string,
    @Headers("idempotency-key") idempotencyHeader?: string,
    @Body() dto?: FinalizeCheckpointDto,
  ) {
    const key = idempotencyHeader || dto?.idempotencyKey;
    return this.attemptsService.finalizeCheckpoint(childId, checkpointId, key);
  }
}

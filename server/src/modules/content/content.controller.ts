import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { ContentService } from "./content.service";
import { AuthGuard } from "@/common/guards/auth.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";
import { Public } from "@/common/decorators/auth.decorators";

@ApiTags("Content & Journey")
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get("worlds")
  @ApiOperation({ summary: "Get all learning worlds" })
  async getWorlds() {
    return this.contentService.getWorlds();
  }

  @Public()
  @Get("subjects")
  @ApiOperation({ summary: "Get curriculum subjects" })
  async getSubjects() {
    return this.contentService.getSubjects();
  }

  @UseGuards(AuthGuard, ChildOwnershipGuard)
  @ApiCookieAuth()
  @Get("children/:childId/journey")
  @ApiOperation({ summary: "Get child learning journey map and mission progress" })
  async getChildJourney(@Param("childId") childId: string) {
    return this.contentService.getChildJourney(childId);
  }

  @UseGuards(AuthGuard, ChildOwnershipGuard)
  @ApiCookieAuth()
  @Get("children/:childId/chapters/:chapterId")
  @ApiOperation({ summary: "Get child chapter overview" })
  async getChildChapter(
    @Param("childId") childId: string,
    @Param("chapterId") chapterId: string,
  ) {
    return this.contentService.getChildChapter(childId, chapterId);
  }

  @UseGuards(AuthGuard, ChildOwnershipGuard)
  @ApiCookieAuth()
  @Get("children/:childId/missions/:missionId")
  @ApiOperation({ summary: "Get mission content for learning (checkpoint answer keys stripped)" })
  async getChildMission(
    @Param("childId") childId: string,
    @Param("missionId") missionId: string,
  ) {
    return this.contentService.getChildMission(childId, missionId);
  }
}

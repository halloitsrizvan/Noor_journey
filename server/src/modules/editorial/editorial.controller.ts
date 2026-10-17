import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { EditorialService } from "./editorial.service";
import { CreateDraftDto, ReviewContentDto, PublishVersionDto } from "./dto/editorial.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { Roles, CurrentUser } from "@/common/decorators/auth.decorators";
import { Account, Role } from "@prisma/client";

@ApiTags("Editorial & Curriculum Review")
@ApiCookieAuth()
@UseGuards(AuthGuard, RolesGuard, CsrfGuard)
@Controller("editorial")
export class EditorialController {
  constructor(private readonly editorialService: EditorialService) {}

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Get("overview")
  @ApiOperation({ summary: "Get editorial & system overview for Admin dashboard" })
  async getOverview() {
    return this.editorialService.getEditorialOverview();
  }

  @Roles(Role.AUTHOR, Role.ADMIN)
  @Post("missions/:missionId/draft")
  @ApiOperation({ summary: "Create a mission draft version (Author only)" })
  async createDraft(
    @CurrentUser() user: Account,
    @Param("missionId") missionId: string,
    @Body() dto: CreateDraftDto,
  ) {
    return this.editorialService.createDraft(user.id, missionId, dto);
  }

  @Roles(Role.AUTHOR, Role.ADMIN)
  @Post("versions/:versionId/submit")
  @ApiOperation({ summary: "Submit draft for editorial & religious review" })
  async submitDraft(
    @CurrentUser() user: Account,
    @Param("versionId") versionId: string,
  ) {
    return this.editorialService.submitDraft(user.id, versionId);
  }

  @Roles(Role.REVIEWER, Role.ADMIN)
  @Post("versions/:versionId/review")
  @ApiOperation({ summary: "Review submitted content (Reviewer cannot be author)" })
  async reviewContent(
    @CurrentUser() user: Account,
    @Param("versionId") versionId: string,
    @Body() dto: ReviewContentDto,
  ) {
    return this.editorialService.reviewContent(user.id, versionId, dto);
  }

  @Roles(Role.ADMIN, Role.REVIEWER)
  @Post("versions/:versionId/publish")
  @ApiOperation({ summary: "Publish reviewed version (Requires mapping and review)" })
  async publishVersion(
    @CurrentUser() user: Account,
    @Param("versionId") versionId: string,
    @Body() dto: PublishVersionDto,
  ) {
    return this.editorialService.publishVersion(user.id, versionId, dto);
  }

  @Roles(Role.ADMIN)
  @Post("versions/:versionId/archive")
  @ApiOperation({ summary: "Archive a mission version" })
  async archiveVersion(@Param("versionId") versionId: string) {
    return this.editorialService.archiveVersion(versionId);
  }

  @Roles(Role.ADMIN)
  @Post("versions/:versionId/withdraw")
  @ApiOperation({ summary: "Safety withdrawal of a mission version" })
  async withdrawVersion(@Param("versionId") versionId: string) {
    return this.editorialService.withdrawVersion(versionId);
  }
}

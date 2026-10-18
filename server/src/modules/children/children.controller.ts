import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { ChildrenService } from "./children.service";
import {
  CreateChildProfileDto,
  UpdateChildProfileDto,
  UpdateAvatarDto,
} from "./dto/children.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";
import { CurrentUser, Public } from "@/common/decorators/auth.decorators";
import { Account } from "@prisma/client";

@ApiTags("Child Profiles")
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("children")
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get("leaderboard")
  @Public()
  @ApiOperation({ summary: "Get public student leaderboard" })
  async getLeaderboard() {
    return this.childrenService.getLeaderboard();
  }

  @Post("sync-student")
  @Public()
  @ApiOperation({ summary: "Sync student learner profile to database" })
  async syncStudent(
    @Body()
    dto: {
      nickname: string;
      email?: string;
      password?: string;
      ageBand?: string;
      priorStandard?: string;
      avatarKey?: string;
      avatarUrl?: string | null;
      weeklyGoal?: number;
      progress?: any;
    }
  ) {
    return this.childrenService.syncStudent(dto);
  }

  @Post("student-login")
  @Public()
  @ApiOperation({ summary: "Student learner login using database" })
  async studentLogin(
    @Body()
    dto: {
      email: string;
      password?: string;
    }
  ) {
    return this.childrenService.studentLogin(dto.email, dto.password);
  }

  @Post("sync-progress")
  @Public()
  @ApiOperation({ summary: "Sync student progress & avatar to database" })
  async syncProgress(
    @Body()
    dto: {
      studentEmail?: string;
      profileId?: string;
      progress: any;
      avatarUrl?: string | null;
      avatarKey?: string;
    }
  ) {
    return this.childrenService.syncProgress(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all children for authenticated parent" })
  async getChildren(@CurrentUser() user: Account) {
    return this.childrenService.getChildren(user.id);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Create a child profile" })
  async createChild(
    @CurrentUser() user: Account,
    @Body() dto: CreateChildProfileDto,
  ) {
    return this.childrenService.createChild(user.id, dto);
  }

  @Get(":id")
  @UseGuards(ChildOwnershipGuard)
  @ApiOperation({ summary: "Get child profile by ID" })
  async getChild(@CurrentUser() user: Account, @Param("id") id: string) {
    return this.childrenService.getChild(user.id, id);
  }

  @Patch(":id")
  @UseGuards(CsrfGuard, ChildOwnershipGuard)
  @ApiOperation({ summary: "Update child profile" })
  async updateChild(
    @CurrentUser() user: Account,
    @Param("id") id: string,
    @Body() dto: UpdateChildProfileDto,
  ) {
    return this.childrenService.updateChild(user.id, id, dto);
  }

  @Delete(":id")
  @UseGuards(CsrfGuard, ChildOwnershipGuard)
  @ApiOperation({ summary: "Delete child profile" })
  async deleteChild(@CurrentUser() user: Account, @Param("id") id: string) {
    return this.childrenService.deleteChild(user.id, id);
  }

  @Patch(":childId/avatar")
  @UseGuards(CsrfGuard, ChildOwnershipGuard)
  @ApiOperation({ summary: "Update child avatar" })
  async updateAvatar(
    @CurrentUser() user: Account,
    @Param("childId") childId: string,
    @Body() dto: UpdateAvatarDto,
  ) {
    return this.childrenService.updateAvatar(user.id, childId, dto.avatarKey);
  }
}

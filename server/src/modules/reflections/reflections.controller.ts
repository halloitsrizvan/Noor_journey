import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCookieAuth } from "@nestjs/swagger";
import { ReflectionsService } from "./reflections.service";
import { CreateReflectionDto } from "./dto/reflections.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { ChildOwnershipGuard } from "@/common/guards/child-ownership.guard";

@ApiTags("Family Reflections")
@ApiCookieAuth()
@UseGuards(AuthGuard, ChildOwnershipGuard)
@Controller("children/:childId/reflections")
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Get()
  @ApiOperation({ summary: "Get child's family reflections" })
  async getReflections(@Param("childId") childId: string) {
    return this.reflectionsService.getReflections(childId);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Record a family reflection" })
  async createReflection(
    @Param("childId") childId: string,
    @Body() dto: CreateReflectionDto,
  ) {
    return this.reflectionsService.createReflection(childId, dto.missionId, dto.note);
  }

  @Delete(":id")
  @UseGuards(CsrfGuard)
  @ApiOperation({ summary: "Delete a family reflection" })
  async deleteReflection(
    @Param("childId") childId: string,
    @Param("id") reflectionId: string,
  ) {
    return this.reflectionsService.deleteReflection(childId, reflectionId);
  }
}

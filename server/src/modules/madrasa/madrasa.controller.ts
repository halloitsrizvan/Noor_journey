import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MadrasaService } from "./madrasa.service";
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  CreateTopicDto,
  UpdateTopicDto,
  UpdateVerseDto,
} from "./dto/madrasa.dto";
import { Public } from "@/common/decorators/auth.decorators";

@ApiTags("Madrasa Subjects & Quran Curriculum")
@Controller("madrasa")
export class MadrasaController {
  constructor(private readonly madrasaService: MadrasaService) {}

  @Public()
  @Get("subjects")
  @ApiOperation({ summary: "Get all Madrasa subjects and curriculum topics from database" })
  async getSubjects() {
    return this.madrasaService.getSubjects();
  }

  @Public()
  @Get("subjects/:key")
  @ApiOperation({ summary: "Get single Madrasa subject by key" })
  async getSubjectByKey(@Param("key") key: string) {
    return this.madrasaService.getSubjectByKey(key);
  }

  @Public()
  @Post("subjects")
  @ApiOperation({ summary: "Create a new Madrasa subject" })
  async createSubject(@Body() dto: CreateSubjectDto) {
    return this.madrasaService.createSubject(dto);
  }

  @Public()
  @Put("subjects/:id")
  @ApiOperation({ summary: "Update an existing Madrasa subject" })
  async updateSubject(@Param("id") id: string, @Body() dto: UpdateSubjectDto) {
    return this.madrasaService.updateSubject(id, dto);
  }

  @Public()
  @Delete("subjects/:id")
  @ApiOperation({ summary: "Delete a Madrasa subject" })
  async deleteSubject(@Param("id") id: string) {
    return this.madrasaService.deleteSubject(id);
  }

  @Public()
  @Post("subjects/:id/topics")
  @ApiOperation({ summary: "Add a curriculum topic to a subject" })
  async createTopic(@Param("id") id: string, @Body() dto: CreateTopicDto) {
    return this.madrasaService.createTopic(id, dto);
  }

  @Public()
  @Put("topics/:topicId")
  @ApiOperation({ summary: "Update a curriculum topic" })
  async updateTopic(@Param("topicId") topicId: string, @Body() dto: UpdateTopicDto) {
    return this.madrasaService.updateTopic(topicId, dto);
  }

  @Public()
  @Delete("topics/:topicId")
  @ApiOperation({ summary: "Delete a curriculum topic" })
  async deleteTopic(@Param("topicId") topicId: string) {
    return this.madrasaService.deleteTopic(topicId);
  }

  @Public()
  @Get("fatihah")
  @ApiOperation({ summary: "Get Surah Al-Fatihah 7 verses and Tajweed course data from database" })
  async getFatihahVerses() {
    return this.madrasaService.getFatihahVerses();
  }

  @Public()
  @Put("fatihah/:verseId")
  @ApiOperation({ summary: "Update Al-Fatihah verse data in database" })
  async updateFatihahVerse(
    @Param("verseId") verseId: string,
    @Body() dto: UpdateVerseDto
  ) {
    return this.madrasaService.updateFatihahVerse(verseId, dto);
  }

  @Public()
  @Get("quran/reciters")
  @ApiOperation({ summary: "Get list of renowned Quran Qaris for recitation practice" })
  getAvailableQaris() {
    return this.madrasaService.getAvailableQaris();
  }

  @Public()
  @Get("quran/fatihah/audio")
  @ApiOperation({ summary: "Get Surah Al-Fatihah high-quality Qira'at audio streams by Qari" })
  async getFatihahAudio(@Query("qari") qari: string) {
    return this.madrasaService.getFatihahQiraat(qari);
  }
}

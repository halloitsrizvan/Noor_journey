import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ReauthenticateDto, ChangePasswordDto } from "./dto/auth.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { CsrfGuard } from "@/common/guards/csrf.guard";
import { Public, CurrentUser } from "@/common/decorators/auth.decorators";
import { AppConfigService } from "@/config/app-config.service";
import { Account } from "@prisma/client";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Parent registration" })
  @ApiResponse({ status: 201, description: "Account created successfully" })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string);
    const userAgent = req.headers["user-agent"];
    const result = await this.authService.register(dto, ip, userAgent);

    this.setSessionCookie(res, result.sessionToken);
    return {
      account: result.account,
      csrfToken: result.csrfToken,
    };
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Parent login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string);
    const userAgent = req.headers["user-agent"];
    const result = await this.authService.login(dto, ip, userAgent);

    this.setSessionCookie(res, result.sessionToken);
    return {
      account: result.account,
      csrfToken: result.csrfToken,
    };
  }

  @UseGuards(AuthGuard, CsrfGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Logout current session" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req as any).sessionToken;
    if (token) {
      await this.authService.logout(token);
    }
    this.clearSessionCookie(res);
    return { success: true };
  }

  @UseGuards(AuthGuard, CsrfGuard)
  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Logout of all active sessions" })
  async logoutAll(@CurrentUser() user: Account, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll(user.id);
    this.clearSessionCookie(res);
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Get("me")
  @ApiCookieAuth()
  @ApiOperation({ summary: "Get current authenticated account details" })
  async getMe(@CurrentUser() user: Account) {
    return this.authService.getMe(user.id);
  }

  @UseGuards(AuthGuard)
  @Get("csrf")
  @ApiCookieAuth()
  @ApiOperation({ summary: "Get fresh session-bound CSRF token" })
  async getCsrf(@Req() req: Request) {
    const sessionToken = (req as any).sessionToken;
    const csrfToken = this.authService.getCsrfToken(sessionToken);
    return { csrfToken };
  }

  @UseGuards(AuthGuard, CsrfGuard)
  @Post("reauthenticate")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Adult reauthentication for sensitive operations" })
  async reauthenticate(@CurrentUser() user: Account, @Body() dto: ReauthenticateDto) {
    const valid = await this.authService.reauthenticate(user.id, dto.password);
    if (!valid) {
      throw new UnauthorizedException({
        errorCode: "REAUTHENTICATION_FAILED",
        message: "Invalid password.",
      });
    }
    return { verified: true };
  }

  @UseGuards(AuthGuard, CsrfGuard)
  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Change account password" })
  async changePassword(
    @CurrentUser() user: Account,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const token = (req as any).sessionToken;
    return this.authService.changePassword(user.id, dto, token);
  }

  private setSessionCookie(res: Response, token: string) {
    res.cookie(this.config.sessionCookieName, token, {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? "none" : "lax",
      maxAge: this.config.sessionTtlDays * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  private clearSessionCookie(res: Response) {
    res.clearCookie(this.config.sessionCookieName, {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? "none" : "lax",
      path: "/",
    });
  }
}

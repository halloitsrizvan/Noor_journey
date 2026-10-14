import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "parent@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "StrongP@ssw0rd!" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: "parent@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "StrongP@ssw0rd!" })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ReauthenticateDto {
  @ApiProperty({ example: "StrongP@ssw0rd!" })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: "CurrentP@ssw0rd!" })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: "NewStrongP@ssw0rd!" })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

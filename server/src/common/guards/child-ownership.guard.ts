import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class ChildOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException({
        errorCode: "UNAUTHENTICATED",
        message: "User context not found.",
      });
    }

    // Admins bypass child ownership check
    if (user.role === "ADMIN") {
      return true;
    }

    // Extract childId from params or body
    const childId =
      request.params.childId ||
      request.params.id ||
      request.body?.childProfileId ||
      request.query?.childId;

    if (!childId) {
      // If endpoint doesn't specify child ID, pass through
      return true;
    }

    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
      select: { id: true, parentAccountId: true },
    });

    if (!child) {
      throw new NotFoundException({
        errorCode: "CHILD_NOT_FOUND",
        message: "Child profile not found.",
      });
    }

    if (child.parentAccountId !== user.id) {
      throw new ForbiddenException({
        errorCode: "CHILD_NOT_OWNED",
        message: "You do not have permission to manage or view this child profile.",
      });
    }

    // Attach validated child profile ID
    request.childProfile = child;

    return true;
  }
}

import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { ClockModule } from "./common/clock/clock.module";
import { CryptoModule } from "./common/crypto/crypto.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ChildrenModule } from "./modules/children/children.module";
import { ContentModule } from "./modules/content/content.module";
import { AttemptsModule } from "./modules/attempts/attempts.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { ReflectionsModule } from "./modules/reflections/reflections.module";
import { ParentReportsModule } from "./modules/parent-reports/parent-reports.module";
import { EditorialModule } from "./modules/editorial/editorial.module";
import { HealthModule } from "./modules/health/health.module";
import { MadrasaModule } from "./modules/madrasa/madrasa.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ClockModule,
    CryptoModule,
    AuthModule,
    ChildrenModule,
    ContentModule,
    AttemptsModule,
    ReviewsModule,
    ReflectionsModule,
    ParentReportsModule,
    EditorialModule,
    HealthModule,
    MadrasaModule,
  ],
})
export class AppModule {}

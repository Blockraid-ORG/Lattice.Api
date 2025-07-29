import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolePermissionsModule } from './role_permissions/role_permissions.module';
import { RolesModule } from './roles/roles.module';
import { SidemenuModule } from './sidemenu/sidemenu.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ChainsModule } from './modules/chains/chains.module';
import { SocialsModule } from './modules/socials/socials.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { VerificationsModule } from './modules/verifications/verifications.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectVerificationsModule } from './modules/project-verifications/project-verifications.module';
import { MembersModule } from './modules/members/members.module';
import { MemberVerificationsModule } from './modules/member-verifications/member-verifications.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UsrClientModule } from './modules/client/usr-client/usr-client.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    MenusModule,
    SidemenuModule,
    FilesModule,
    ChainsModule,
    SocialsModule,
    CategoriesModule,
    VerificationsModule,
    ProjectsModule,
    ProjectVerificationsModule,
    MembersModule,
    MemberVerificationsModule,
    ProfileModule,
    UsrClientModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

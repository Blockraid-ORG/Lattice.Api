-- CreateEnum
CREATE TYPE "PaymentHistoryType" AS ENUM ('PROJECT_LISTING_FEE', 'PRESALE_FEE');

-- CreateEnum
CREATE TYPE "FileStorage" AS ENUM ('LOCAL', 'AWS', 'GCS', 'DOSpaces');

-- CreateEnum
CREATE TYPE "EnumVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EnumUserCategory" AS ENUM ('UNSIGNED', 'PERSONAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "EnumUserType" AS ENUM ('INTERNAL', 'PUBLIC', 'PROJECT_OWNER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DEPLOYED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FrequencyCategory" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "EnumProjectStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DEPLOYED');

-- CreateEnum
CREATE TYPE "ChianType" AS ENUM ('Mainnet', 'Testnet');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "password" TEXT,
    "refreshToken" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "category" "EnumUserCategory" NOT NULL DEFAULT 'PERSONAL',
    "type" "EnumUserType" NOT NULL DEFAULT 'PUBLIC',
    "walletAddress" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_nonce_login" (
    "id" TEXT NOT NULL,
    "walletAddress" VARCHAR(128) NOT NULL,
    "nonce" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_nonce_login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "method" VARCHAR(64) NOT NULL,
    "path" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "permissionId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isGroup" BOOLEAN DEFAULT false,
    "icon" TEXT,
    "path" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_menus" (
    "roleId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "role_menus_pkey" PRIMARY KEY ("roleId","menuId")
);

-- CreateTable
CREATE TABLE "file_logs" (
    "id" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storage" "FileStorage" NOT NULL DEFAULT 'LOCAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "file_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "isParent" BOOLEAN DEFAULT false,
    "icon" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "frequency" "FrequencyCategory" NOT NULL,
    "frequencyCount" INTEGER NOT NULL DEFAULT 1,
    "targetYield" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "EnumUserCategory" NOT NULL,
    "IDCardRequired" BOOLEAN NOT NULL,
    "SelfieRequired" BOOLEAN NOT NULL,
    "BussinessLicenseRequired" BOOLEAN NOT NULL DEFAULT false,
    "TaxIdRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chains" (
    "id" TEXT NOT NULL,
    "chainid" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR(32) NOT NULL,
    "aliasName" TEXT,
    "ticker" VARCHAR(8) NOT NULL,
    "logo" TEXT,
    "urlScanner" TEXT,
    "urlRpc" TEXT,
    "urlApi" TEXT,
    "type" "ChianType" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "slug" VARCHAR(128) NOT NULL,
    "logo" TEXT NOT NULL,
    "banner" TEXT,
    "ticker" TEXT,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "totalSupply" DECIMAL(65,18) NOT NULL,
    "detail" TEXT NOT NULL,
    "status" "EnumProjectStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "projectTypeId" TEXT,
    "contractAddress" TEXT,
    "factoryAddress" TEXT,
    "whitelistsAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "lockerDistributed" BOOLEAN NOT NULL DEFAULT false,
    "lockerDistributeHash" TEXT,
    "rewardContractAddress" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "paused" BOOLEAN DEFAULT false,
    "presaleAddress" TEXT,
    "presaleUnit" TEXT,
    "whitelistDuration" INTEGER,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_types" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_chains" (
    "projectId" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_chains_pkey" PRIMARY KEY ("projectId","chainId")
);

-- CreateTable
CREATE TABLE "project_allocations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "supply" INTEGER NOT NULL,
    "vesting" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "isPresale" BOOLEAN NOT NULL DEFAULT false,
    "isDeploying" BOOLEAN NOT NULL DEFAULT false,
    "sortNumber" INTEGER NOT NULL DEFAULT 0,
    "isFinalized" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "contractAddress" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_allocation_address" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "contractAddress" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "projectAllocationId" TEXT,
    "isClaimed" BOOLEAN DEFAULT false,

    CONSTRAINT "project_allocation_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_review_logs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "EnumProjectStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_review_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_socials" (
    "projectId" TEXT NOT NULL,
    "socialId" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_socials_pkey" PRIMARY KEY ("projectId","socialId")
);

-- CreateTable
CREATE TABLE "project_presales" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "hardcap" DECIMAL(65,18) NOT NULL,
    "price" DECIMAL(65,18) NOT NULL,
    "maxContribution" DECIMAL(65,18) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 1,
    "claimTime" INTEGER NOT NULL DEFAULT 1,
    "unit" VARCHAR(64) NOT NULL,
    "presaleSCID" INTEGER,
    "contractAddress" TEXT,
    "whitelistContract" TEXT,
    "whitelistDuration" INTEGER,
    "sweepDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN DEFAULT false,
    "isWithdrawn" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_presales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presale_address_whitelist" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "presaleId" TEXT,

    CONSTRAINT "presale_address_whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_presale_whitelist_address" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "projectId" TEXT,

    CONSTRAINT "project_presale_whitelist_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_presales" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "presaleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "price" DECIMAL(65,18) NOT NULL,
    "count" DECIMAL(65,18) NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "transaction_presales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_owner_verifications" (
    "userId" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "idCard" VARCHAR(255),
    "selfie" VARCHAR(255),
    "bisnisLicense" VARCHAR(255),
    "taxId" VARCHAR(255),
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "status" "EnumVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_owner_verifications_pkey" PRIMARY KEY ("userId","verificationId")
);

-- CreateTable
CREATE TABLE "review_verification_log" (
    "id" TEXT NOT NULL,
    "status" "EnumVerificationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "projectOwnerVerificationUserId" TEXT NOT NULL,
    "projectOwnerVerificationVerificationId" TEXT NOT NULL,

    CONSTRAINT "review_verification_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresaleClaimedToken" (
    "id" TEXT NOT NULL,
    "presaleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "PresaleClaimedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_reward_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "additional_reward_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_asset_rewards" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "typeId" TEXT NOT NULL,
    "startDateClaim" TIMESTAMP(3),
    "endDateClaim" TIMESTAMP(3),
    "contactAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "scheduleId" TEXT,

    CONSTRAINT "additional_asset_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_additional_rewars" (
    "id" TEXT NOT NULL,
    "additionalRewardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DECIMAL(65,18) NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "user_additional_rewars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address_pool_payments" (
    "id" TEXT NOT NULL,
    "paymentSc" TEXT NOT NULL DEFAULT '0x779aa5C7ff04B6Ba48464bcEA0a60134Df9E6AFf',
    "stableCoinId" TEXT,
    "listingFee" TEXT NOT NULL DEFAULT '0',
    "presaleFee" INTEGER NOT NULL DEFAULT 1,
    "decimal" INTEGER NOT NULL DEFAULT 6,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "address_pool_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_stable_coin_groups" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "m_stable_coin_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_stable_coins" (
    "id" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "stableCoinGroupId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "m_stable_coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_histories" (
    "id" TEXT NOT NULL,
    "type" "PaymentHistoryType" NOT NULL,
    "address" TEXT NOT NULL,
    "projectId" TEXT,
    "presaleId" TEXT,
    "amount" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "transactionHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "payment_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_email_walletAddress_idx" ON "users"("email", "walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_nonce_login_walletAddress_key" ON "user_nonce_login"("walletAddress");

-- CreateIndex
CREATE INDEX "user_nonce_login_walletAddress_idx" ON "user_nonce_login"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "project_allocation_address_address_idx" ON "project_allocation_address"("address");

-- CreateIndex
CREATE UNIQUE INDEX "project_allocation_address_projectAllocationId_address_key" ON "project_allocation_address"("projectAllocationId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "user_additional_rewars_additionalRewardId_userId_key" ON "user_additional_rewars"("additionalRewardId", "userId");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "project_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_chains" ADD CONSTRAINT "project_chains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_chains" ADD CONSTRAINT "project_chains_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocations" ADD CONSTRAINT "project_allocations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation_address" ADD CONSTRAINT "project_allocation_address_projectAllocationId_fkey" FOREIGN KEY ("projectAllocationId") REFERENCES "project_allocations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_review_logs" ADD CONSTRAINT "project_review_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_socials" ADD CONSTRAINT "project_socials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_socials" ADD CONSTRAINT "project_socials_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "socials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_presales" ADD CONSTRAINT "project_presales_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presale_address_whitelist" ADD CONSTRAINT "presale_address_whitelist_presaleId_fkey" FOREIGN KEY ("presaleId") REFERENCES "project_presales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_presale_whitelist_address" ADD CONSTRAINT "project_presale_whitelist_address_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_presales" ADD CONSTRAINT "transaction_presales_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_presales" ADD CONSTRAINT "transaction_presales_presaleId_fkey" FOREIGN KEY ("presaleId") REFERENCES "project_presales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_presales" ADD CONSTRAINT "transaction_presales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_owner_verifications" ADD CONSTRAINT "project_owner_verifications_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "verifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_owner_verifications" ADD CONSTRAINT "project_owner_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_verification_log" ADD CONSTRAINT "review_verification_log_projectOwnerVerificationUserId_pro_fkey" FOREIGN KEY ("projectOwnerVerificationUserId", "projectOwnerVerificationVerificationId") REFERENCES "project_owner_verifications"("userId", "verificationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresaleClaimedToken" ADD CONSTRAINT "PresaleClaimedToken_presaleId_fkey" FOREIGN KEY ("presaleId") REFERENCES "project_presales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresaleClaimedToken" ADD CONSTRAINT "PresaleClaimedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_asset_rewards" ADD CONSTRAINT "additional_asset_rewards_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "additional_reward_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_asset_rewards" ADD CONSTRAINT "additional_asset_rewards_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_additional_rewars" ADD CONSTRAINT "user_additional_rewars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_additional_rewars" ADD CONSTRAINT "user_additional_rewars_additionalRewardId_fkey" FOREIGN KEY ("additionalRewardId") REFERENCES "additional_asset_rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_pool_payments" ADD CONSTRAINT "address_pool_payments_stableCoinId_fkey" FOREIGN KEY ("stableCoinId") REFERENCES "m_stable_coins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_stable_coins" ADD CONSTRAINT "m_stable_coins_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_stable_coins" ADD CONSTRAINT "m_stable_coins_stableCoinGroupId_fkey" FOREIGN KEY ("stableCoinGroupId") REFERENCES "m_stable_coin_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_histories" ADD CONSTRAINT "payment_histories_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_histories" ADD CONSTRAINT "payment_histories_presaleId_fkey" FOREIGN KEY ("presaleId") REFERENCES "project_presales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

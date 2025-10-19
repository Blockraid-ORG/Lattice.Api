import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function createVerifications() {
  return prisma.verification.createMany({
    data: [
      {
        name: 'KYC',
        type: 'PERSONAL',
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: false,
        TaxIdRequired: false,
      },
      {
        name: 'KYB',
        type: 'CORPORATE',
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: true,
        TaxIdRequired: true,
      },
    ],
  });
}

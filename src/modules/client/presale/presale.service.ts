import { Injectable } from '@nestjs/common';
import { AddWhitelistDto, CreatePresaleDto } from './dto/create-presale.dto';
import { UpdatePresaleDto } from './dto/update-presale.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PresaleService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreatePresaleDto) {
    return dto;
  }

  findAll() {
    return `This action returns all presale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presale`;
  }

  update(id: number, dto: UpdatePresaleDto) {
    return `This action updates a #${id} presale ${dto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} presale`;
  }

  // Extra

  async addWhitelist(dto: AddWhitelistDto) {
    // Remove all exist by presaleId
    // Re Insert all
    const data = dto.walletAddress.map((item) => {
      return {
        presaleId: dto.presaleId,
        walletAddress: item,
      };
    });
    const result = await this.prisma.$transaction(async (tx) => {
      const deletedAddress = await tx.presaleAddressWhitelist.deleteMany({
        where: {
          presaleId: dto.presaleId,
        },
      });
      const createdAddress = await tx.presaleAddressWhitelist.createMany({
        data: data,
      });
      return { deletedAddress, createdAddress };
    });
    return result;
  }
}

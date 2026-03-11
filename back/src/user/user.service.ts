import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({ data });
  }

  findAll(userId: number) {
    const user = this.prisma.user.findUnique({
      where: { id: userId }
    });

    // if(user.role !== 'admin') throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        financialData: true
      },
    });
  }

  findOne(userId: number, id: number) {
    console.log(userId, id)
    if (userId !== id) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        financialData: true
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(userId: number, id: number, updateUserDto: UpdateUserDto) {
    // const requestUser = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // if(requestUser.id !== id && requestUser.role !== 'admin') throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (updateUserDto.financialData) {
      await this.prisma.financialData.upsert({
        where: { userId: id },
        update: updateUserDto.financialData,
        create: { ...updateUserDto.financialData, userId: id }
      })
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password
      },
    });
    return user;
  }
}

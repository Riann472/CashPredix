import { HttpException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Transaction } from '@prismagen';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  private getTransactionData(transactions: Transaction[], type: string) {
    const filtered = transactions.filter(t => t.type == type)
    let sum = 0

    filtered.forEach(t => {
      sum += t.amount
    })
    return sum
  }

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    if (!userId) { throw new HttpException("User ID is required to create a transaction.", 400); }
    const financialData = await this.prisma.financialData.findUnique({
      where: { userId }
    });

    if (financialData) {
      await this.prisma.financialData.update({
        where: { userId },
        data: {
          balance: {
            increment: createTransactionDto.type === 'income'
              ? createTransactionDto.amount
              : -createTransactionDto.amount
          }
        }
      });
    }

    return await this.prisma.transaction.create({
      data: { ...createTransactionDto, userId }
    });
  }

  async findAll(userId: number) {
    return await this.prisma.transaction.findMany({
      where: { userId: undefined }
    });
  }

  async findAllSummary(userId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId }
    });
    const expenses = this.getTransactionData(transactions, "expense")
    const income = this.getTransactionData(transactions, "income")
    const recentTransactions = transactions.slice(0, 5)

    return { transactions: recentTransactions, expenses, income }

  }

  async findOne(userId: number,id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

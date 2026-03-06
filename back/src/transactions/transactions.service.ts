import { Injectable } from '@nestjs/common';
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

  async create(createTransactionDto: CreateTransactionDto) {
    await this.prisma.financialData.update({
      where: { userId: 1 },
      data: {
        balance: {
          increment: createTransactionDto.type === 'income'
            ? createTransactionDto.amount
            : -createTransactionDto.amount
        }
      }
    });
    return await this.prisma.transaction.create({
      data: createTransactionDto
    });
  }
  
  async findAll(id: number) {
    return await this.prisma.transaction.findMany({
      where: {
        userId: id
      }
    });
  }

  async findAllSummary(id: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: id
      }
    });
    const expenses = this.getTransactionData(transactions, "expense")
    const income = this.getTransactionData(transactions, "income")
    const recentTransactions = transactions.slice(0, 5)

    return { transactions: recentTransactions, expenses, income }

  }

  async findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

import { IsInt, IsNumber, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TransactionType } from '@prismagen';

export class CreateTransactionDto {
  @IsInt()
  userId: number;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}
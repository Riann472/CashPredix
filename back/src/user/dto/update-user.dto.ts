import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateFinancialDataDto {
  @IsOptional()
  salary?: number;

  @IsOptional()
  extraIncome?: number;

  @IsOptional()
  extraIncomeType?: "monthly" | "weekly";

  @IsOptional()
  balance?: number;

  @IsOptional()
  fixedExpenses?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
  
  @IsOptional()
  financialData?: UpdateFinancialDataDto
}
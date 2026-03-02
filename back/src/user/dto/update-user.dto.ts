import { IsOptional, IsString, IsEmail, MinLength, IsNumber, IsEnum } from 'class-validator';

export class UpdateFinancialDataDto {
  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  extraIncome?: number;

  @IsOptional()
  @IsEnum(["monthly", "weekly"])
  extraIncomeType?: "monthly" | "weekly";

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsNumber()
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
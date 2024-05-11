import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UserFilterDto extends PaginationDto {
  @ApiProperty({
    title: 'Status',
    description: 'Статус пользователя',
    enum: EUserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(EUserStatus)
  status?: EUserStatus | null;
}

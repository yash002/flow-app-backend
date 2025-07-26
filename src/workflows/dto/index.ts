import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsArray()
  components: any[];

  @ApiProperty()
  @IsArray()
  connections: any[];

  @ApiProperty()
  @IsObject()
  configurations: object;
}

export class UpdateWorkflowDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  components?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  connections?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  configurations?: object;
}

export class ValidateWorkflowDto {
  @ApiProperty()
  @IsArray()
  components: any[];

  @ApiProperty()
  @IsArray()
  connections: any[];
}

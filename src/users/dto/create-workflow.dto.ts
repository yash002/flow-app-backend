import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

class ComponentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsObject()
  data: any;

  @ApiProperty()
  @IsObject()
  position: { x: number; y: number };

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  style?: any;
}

class ConnectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sourceHandle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  targetHandle?: string;
}

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ type: [ComponentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  components: ComponentDto[];

  @ApiProperty({ type: [ConnectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectionDto)
  connections: ConnectionDto[];

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  configurations?: object;
}

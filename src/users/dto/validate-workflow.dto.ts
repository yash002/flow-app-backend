import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

class ValidateComponentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  data: {
    type: 'input' | 'process' | 'output' | 'condition';
    label: string;
    config?: any;
  };

  @ApiProperty()
  position: { x: number; y: number };
}

class ValidateConnectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  target: string;

  @ApiProperty({ required: false })
  sourceHandle?: string;

  @ApiProperty({ required: false })
  targetHandle?: string;
}

export class ValidateWorkflowDto {
  @ApiProperty({ type: [ValidateComponentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateComponentDto)
  components: ValidateComponentDto[];

  @ApiProperty({ type: [ValidateConnectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateConnectionDto)
  connections: ValidateConnectionDto[];
}

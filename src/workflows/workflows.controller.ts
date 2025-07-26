import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkflowDto, UpdateWorkflowDto, ValidateWorkflowDto } from './dto';
import { WorkflowsService } from './workflows.service';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow successfully created' })
  async create(@Body() createWorkflowDto: CreateWorkflowDto, @Request() req) {
    return this.workflowsService.create(createWorkflowDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows for the authenticated user' })
  async findAll(@Request() req) {
    return this.workflowsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific workflow by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.workflowsService.findOneByUser(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  async update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto, @Request() req) {
    return this.workflowsService.update(id, updateWorkflowDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.workflowsService.remove(id, req.user.userId);
    return { message: 'Workflow deleted successfully' };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a workflow configuration' })
  async validate(@Body() validateWorkflowDto: ValidateWorkflowDto) {
    return this.workflowsService.validateWorkflow(validateWorkflowDto);
  }
}

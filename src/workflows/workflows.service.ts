import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkflowDto, UpdateWorkflowDto, ValidateWorkflowDto } from './dto';
import { Workflow } from './entities/workflow.entity';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private workflowsRepository: Repository<Workflow>,
  ) {}

  async create(createWorkflowDto: CreateWorkflowDto, userId: string): Promise<Workflow> {
    const workflow = this.workflowsRepository.create({
      ...createWorkflowDto,
      userId,
    });
    return this.workflowsRepository.save(workflow);
  }

  async findAllByUser(userId: string): Promise<Workflow[]> {
    return this.workflowsRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({
      where: { id, userId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto, userId: string): Promise<Workflow> {
    const workflow = await this.findOneByUser(id, userId);
    console.log("Updating workflow:", workflow);
    console.log("With update data:", updateWorkflowDto);
    
    // Object.assign(workflow, updateWorkflowDto);

    const sanitizedUpdateWorkFlow =  Object.keys(updateWorkflowDto).reduce((acc, key) => {
      console.log(`Processing key: ${key}, value: ${updateWorkflowDto[key]}`);
      
      if ((typeof updateWorkflowDto[key] != "undefined")) {
        acc[key] = updateWorkflowDto[key];
      }
      return acc;
    }, {});

    console.log("Sanitized update data:", sanitizedUpdateWorkFlow);
    
    const workflowTobeSave = { ...workflow, ...sanitizedUpdateWorkFlow };

    console.log("Combined object :", workflowTobeSave);
    
    const result = await this.workflowsRepository.save(workflowTobeSave);
    console.log("Updated workflow:", result);
    // return this.workflowsRepository.save(workflow);
    return result;
  }

  async remove(id: string, userId: string): Promise<void> {
    const workflow = await this.findOneByUser(id, userId);
    await this.workflowsRepository.remove(workflow);
  }

  async validateWorkflow(validateWorkflowDto: ValidateWorkflowDto): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { components, connections } = validateWorkflowDto;

    if (!components || components.length === 0) {
      errors.push('Workflow must have at least one component');
      return { valid: false, errors };
    }

    const essentialErrors = this.validateEssentials(components, connections);
    errors.push(...essentialErrors);

    const configWarnings = this.validateOptionalConfigurations(components);
    warnings.push(...configWarnings);

    const criticalErrors = this.validateCriticalIssues(components, connections);
    errors.push(...criticalErrors);

    return {
      valid: errors.length === 0,
      errors: [...errors, ...warnings.map(w => `⚠️ ${w}`)], 
    };
  }

  private validateEssentials(components: any[], connections: any[]): string[] {
    const errors: string[] = [];

    // Basic component validation - only check critical fields
    components.forEach(component => {
      if (!component.id) {
        errors.push(`Component is missing ID`);
        return;
      }

      if (!component.data?.type) {
        errors.push(`Component "${component.id}" is missing type`);
        return;
      }

      // Validate component type
      const validTypes = ['input', 'process', 'output', 'condition'];
      if (!validTypes.includes(component.data.type)) {
        errors.push(`Component has invalid type: ${component.data.type}`);
      }
    });

    // Basic connection validation
    connections.forEach(connection => {
      if (!connection.source || !connection.target) {
        errors.push(`Connection is missing source or target`);
        return;
      }

      // Check if source and target components exist
      const sourceExists = components.some(c => c.id === connection.source);
      const targetExists = components.some(c => c.id === connection.target);

      if (!sourceExists) {
        errors.push(`Connection references missing source component`);
      }

      if (!targetExists) {
        errors.push(`Connection references missing target component`);
      }

      // Prevent self-connections
      if (connection.source === connection.target) {
        errors.push(`Component cannot connect to itself`);
      }
    });

    return errors;
  }

  private validateOptionalConfigurations(components: any[]): string[] {
    const warnings: string[] = [];

    components.forEach(component => {
      const { data } = component;
      const label = data?.label || component.id;

      // Only warn about missing configurations, don't error
      switch (data?.type) {
        case 'input':
          if (!data.config?.inputType) {
            warnings.push(`Input "${label}" could benefit from specifying an input type`);
          }
          break;

        case 'process':
          if (!data.config?.processType) {
            warnings.push(`Process "${label}" could benefit from specifying a process type`);
          }
          break;

        case 'output':
          if (!data.config?.outputFormat) {
            warnings.push(`Output "${label}" could benefit from specifying an output format`);
          }
          break;

        case 'condition':
          if (!data.config?.condition) {
            warnings.push(`Condition "${label}" could benefit from defining condition logic`);
          }
          break;
      }
    });

    return warnings;
  }

  private validateCriticalIssues(components: any[], connections: any[]): string[] {
    const errors: string[] = [];

    // Only check for truly critical issues
    
    // 1. Check for completely disconnected workflows (if more than 1 component)
    if (components.length > 1 && connections.length === 0) {
      errors.push('Multiple components exist but none are connected');
    }

    // 2. Check for obvious circular dependencies (simple check)
    if (this.hasObviousCircularDependency(connections)) {
      errors.push('Workflow contains circular dependencies');
    }

    // 3. Check if workflow has any flow path (relaxed)
    const hasInputs = components.some(c => c.data?.type === 'input');
    const hasOutputs = components.some(c => c.data?.type === 'output');
    
    if (components.length > 2 && !hasInputs) {
      errors.push('Workflow should have at least one input component');
    }
    
    if (components.length > 2 && !hasOutputs) {
      errors.push('Workflow should have at least one output component');
    }

    return errors;
  }

  private hasObviousCircularDependency(connections: any[]): boolean {
    // Simplified circular dependency check - only catch obvious cases
    const directCircles = new Set<string>();
    
    connections.forEach(conn => {
      // Check for immediate back-and-forth connections
      const reverseExists = connections.some(
        reverseConn => reverseConn.source === conn.target && reverseConn.target === conn.source
      );
      
      if (reverseExists) {
        directCircles.add(conn.source);
      }
    });

    return directCircles.size > 0;
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateFormDto } from "src/dto/create.form.dto";
import { FormService } from "src/services/form.services";

@ApiTags('Form')
@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @ApiOperation({ summary: 'Submit a new form' })
    @ApiResponse({ status: 201, description: 'Form created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @Post('submit')
    async submitForm(@Body() form: CreateFormDto) {
        return this.formService.CreateForm(form);
    }

    @ApiOperation({ summary: 'Get all forms' })
    @ApiResponse({ status: 200, description: 'Forms retrieved successfully' })
    @ApiResponse({ status: 404, description: 'No forms found' })
    @Get('getAll')
    async getForm() {
        return this.formService.getAllForms();
    }

    @ApiOperation({ summary: 'Get form by ID' })
    @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid ID format' })
    @ApiResponse({ status: 404, description: 'Form not found' })
    @Get('get/:id')
    async getFormById(@Param('id') id: string) {
        return this.formService.getFormById(id);
    }
}

import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiAcceptedResponse, ApiResponse } from "@nestjs/swagger";
import { CreateFormDto } from "src/dto/create.form.dto";
import { FormService } from "src/services/form.services";

@Controller('form')
export class controllerFormModule {
    constructor(private readonly formService: FormService) {}
    @ApiAcceptedResponse({ description: 'Form submitted successfully' })
    @ApiResponse({ status: 201, description: 'Form created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Post('submit')
    async submitForm(@Body() form: CreateFormDto) {
        return this.formService.CreateForm(form);
    }
    
    @ApiResponse({ status: 200, description: 'Forms retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Form not found.' })
    @Get('getAll')
    async getForm() {
        return this.formService.getAllForms();
    }
    @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Form not found.' })
    @Get('get/:id')
    async getFormById(@Body('id') id: string) {
        return this.formService.getFormById(id);
    }
}
import { BadRequestException, Injectable, InternalServerErrorException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateFormDto } from "src/dto/create.form.dto";
import { Form } from "src/models/forms.models";

@Injectable()
export class FormService {
    constructor(@InjectModel('Form') private formModel: Model<Form>) { }

    async CreateForm(form: CreateFormDto): Promise<any> {
        try {
            if (form.pet == null || form.pet == undefined || form.pet == "")
                throw new BadRequestException("Id of Pet is required.");


            const newForm = new this.formModel(form);
            const savedForm = await newForm.save();

            return {
                message: 'Form created successfully.',
                statusCode: HttpStatus.CREATED,
                redirect: '/forms',
                data: savedForm,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating form: ' + error.message);
        }
    }

    async getAllForms(): Promise<Form[]> {
        return this.formModel.find().exec();
    }

    async getFormById(id: string): Promise<Form> {
        const form = await this.formModel.findById(id).exec();
        if (!form)
            throw new BadRequestException("Form not found.");
        return form;
    }
}

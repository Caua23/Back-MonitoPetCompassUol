import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateFormDto } from "src/dto/create.form.dto";
import { Form } from "src/models/forms.models";

@Injectable()
export class FormService {
    constructor(@InjectModel('Form') private formModel: Model<Form>) { }
    async CreateForm(form: CreateFormDto): Promise<any> {
        try{

            const userExists = await this.formModel.findOne({ email: form.email.toLowerCase() });
            if (userExists) HttpException.createBody(400, "User already exists with this email.", HttpStatus.BAD_REQUEST);
            if (form.pet == null) HttpException.createBody(400, "Id of Pet is required.", HttpStatus.BAD_REQUEST);
            const newForm = new this.formModel(form);
            newForm.save()
            return HttpException.createBody(201, "Form created successfully.", HttpStatus.CREATED);
        }catch (error) {    
            return HttpException.createBody( 500, "Error creating form: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllForms(): Promise<Form[]> {
        return this.formModel.find().exec();
    }
    async getFormById(id: string): Promise<Form> {
        const form = await this.formModel.findById(id).exec();
        if (!form) throw new BadRequestException("Form not found.");
        return form;
    }
}

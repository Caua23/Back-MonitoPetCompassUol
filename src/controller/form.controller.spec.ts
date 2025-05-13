import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from 'src/services/form.services';
import { CreateFormDto } from 'src/dto/create.form.dto';

describe('FormController', () => {
  let formController: FormController;
  let formService: FormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: {
            CreateForm: jest.fn().mockResolvedValue({}),
            getAllForms: jest.fn().mockResolvedValue([]),
            getFormById: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    formController = module.get<FormController>(FormController);
    formService = module.get<FormService>(FormService);
  });

  it('should be defined', () => {
    expect(formController).toBeDefined();
  });

  describe('submitForm', () => {
    it('should call FormService.CreateForm', async () => {
      const formDto = new CreateFormDto();
      formDto.email = 'a@b.com';
      formDto.name = 'testeunitario';
      formDto.pet = '6821ecf034fe0aaf0f344f8e';
      formDto.cidade = 'Viamão';
      formDto.estado = 'RS';
      formDto.message = 'Teste';
      formDto.phone = '518325235355';

      await formController.submitForm(formDto);

      expect(formService.CreateForm).toHaveBeenCalledWith(formDto);
      expect(formService.CreateForm).toHaveBeenCalledTimes(1); // Garantir que a função foi chamada apenas uma vez
    });
  });

  describe('getForm', () => {
    it('should call FormService.getAllForms', async () => {
      await formController.getForm();
      expect(formService.getAllForms).toHaveBeenCalled();
      expect(formService.getAllForms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFormById', () => {
    it('should call FormService.getFormById with correct ID', async () => {
      const id = '123';
      await formController.getFormById(id);
      expect(formService.getFormById).toHaveBeenCalledWith(id);
      expect(formService.getFormById).toHaveBeenCalledTimes(1);
    });
  });
});

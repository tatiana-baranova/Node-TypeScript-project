import { JsonController, Get, Post, Body, Param } from 'routing-controllers';
import { IPerson } from './Person.types';
import { ApiError } from 'helpers/ApiError';
import { ApiResponse } from 'helpers/ApiResponse';
import { validate } from 'class-validator';
import { CreatePerson } from './CreatePerson.dto';
import { plainToInstance } from 'class-transformer';

const storeData: IPerson[] = [];

@JsonController('/person')
export default class Person {
  @Get()
  async getAll() {
    return new ApiResponse(true, storeData);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ApiResponse<IPerson | {}>> {
    const person = storeData.find((item) => {
      return item.id === id;
    });
    if (!person) {
      throw new ApiError(404, {
        code: 'PERSON_NOT_FOUND',
        message: `Person with id ${id} not found`,
      });
    }
    return new ApiResponse(true, person);
  }

  // @Post()
  // async setPerson(@Body() body: CreatePerson) {
  //   const id = storeData.length;
  //   storeData.push({ ...body, id });
  //   return new ApiResponse(true, 'Person successfully created');
  // }
  @Post()
  async setPerson(@Body() body: CreatePerson) {
    const dto = plainToInstance(CreatePerson, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new ApiError(400, {
        message: 'Validation failed',
        code: 'PERSON_VALIDATION_ERROR',
        errors,
      });
    }

    const id = storeData.length;
    storeData.push({ ...dto, id });
    return new ApiResponse(true, 'Person successfully created');
  }
}

export class CreateEmployeeDto {
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  start_date: Date;
  cafeId?: string;
}

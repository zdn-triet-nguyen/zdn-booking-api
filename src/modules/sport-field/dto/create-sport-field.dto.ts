export class CreateSportFieldDto {
  name: string;
  quantity: number;
  phone: string;
  startTime: string;
  endTime: string;
  price: number;
  rule: string;
  sportFieldTypeId: number;
  locationId: number;
  sportFieldImages: { name: string; url: string }[];
  fields: { name: string }[];
}

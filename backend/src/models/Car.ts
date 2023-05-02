export class Car {
  car_vehicleId: number;
  car_model?: string;
  car_year?: number;
  car_typeId?: number;
  car_typeName?: string;
  car_ownerId?: number;
  car_ownerName?: string;

    constructor(car_vehicleId: number, car_model?: string, car_year?: number, car_typeId?: number, car_ownerId?: number,car_typeName?: string, car_ownerName?: string) {
      this.car_vehicleId = car_vehicleId;
      this.car_model = car_model;
      this.car_year = car_year;
      this.car_typeId = car_typeId;
      this.car_typeName = car_typeName;
      this.car_ownerId = car_ownerId;
      this.car_ownerName = car_ownerName;
    }
  }
  
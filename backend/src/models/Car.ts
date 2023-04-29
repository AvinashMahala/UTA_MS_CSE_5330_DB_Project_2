export class Car {
    vehicleId: number;
    model: string;
    year: number;
    typeId: number;
    ownerId: number;
  
    constructor(vehicleId: number, model: string, year: number, typeId: number, ownerId: number) {
      this.vehicleId = vehicleId;
      this.model = model;
      this.year = year;
      this.typeId = typeId;
      this.ownerId = ownerId;
    }
  }
  
export class CarAvailability {
    availabilityId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    carModel: string;
  
    constructor(availabilityId: number, carId: number, startDate: Date, endDate: Date, carModel: string) {
      this.availabilityId = availabilityId;
      this.carId = carId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.carModel = carModel;
    }
  }
  
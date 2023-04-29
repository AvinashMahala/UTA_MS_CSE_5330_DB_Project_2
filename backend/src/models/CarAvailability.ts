export class CarAvailability {
    availabilityId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
  
    constructor(availabilityId: number, carId: number, startDate: Date, endDate: Date) {
      this.availabilityId = availabilityId;
      this.carId = carId;
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }
  
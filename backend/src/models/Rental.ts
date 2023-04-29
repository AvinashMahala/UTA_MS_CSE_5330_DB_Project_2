export class Rental {
    rentalId: number;
    rentalType: string;
    noOfDays: number;
    noOfWeeks: number;
    startDate: Date;
    returnDate: Date;
    amountDue: number;
    carId: number;
    customerId: number;
  
    constructor(
      rentalId: number,
      rentalType: string,
      noOfDays: number,
      noOfWeeks: number,
      startDate: Date,
      returnDate: Date,
      amountDue: number,
      carId: number,
      customerId: number
    ) {
      this.rentalId = rentalId;
      this.rentalType = rentalType;
      this.noOfDays = noOfDays;
      this.noOfWeeks = noOfWeeks;
      this.startDate = startDate;
      this.returnDate = returnDate;
      this.amountDue = amountDue;
      this.carId = carId;
      this.customerId = customerId;
    }
  }
  
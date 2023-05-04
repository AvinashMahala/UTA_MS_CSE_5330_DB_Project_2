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

  
  
  export class RentalView {
    rentalId: number;
    rentalType: string;
    vehicleId: number;
    model: string;
    customerId: number;
    customerName: string;
    startDate: Date;
    returnDate: Date;
    noOfDays: number;
    noOfWeeks: number;
    amountDue: number;
    
    constructor(rentalId: number, rentalType: string, vehicleId: number, model: string, customerId: number, customerName: string, startDate: Date, returnDate: Date, noOfDays: number, noOfWeeks: number, amountDue: number) {
      this.rentalId = rentalId;
      this.rentalType = rentalType;
      this.vehicleId = vehicleId;
      this.model = model;
      this.customerId = customerId;
      this.customerName = customerName;
      this.startDate = startDate;
      this.returnDate = returnDate;
      this.noOfDays = noOfDays;
      this.noOfWeeks = noOfWeeks;
      this.amountDue = amountDue;
    }
    }
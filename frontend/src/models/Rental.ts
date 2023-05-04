export interface Rental {
    rentalId: number;
    rentalType: string;
    noOfDays: number | null;
    noOfWeeks: number | null;
    startDate: Date;
    returnDate: Date;
    amountDue: number;
    carId: number;
    customerId: number;
  }
  
  export interface RentalView {
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
    }
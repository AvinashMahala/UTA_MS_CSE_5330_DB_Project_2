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
  
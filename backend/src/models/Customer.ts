export class Customer {
    idNo: number;
    name: string;
    phone: string;
  
    constructor(idNo: number, name: string, phone: string) {
      this.idNo = idNo;
      this.name = name;
      this.phone = phone;
    }
  }
  


  export class CustomerDetailsViewModel {
    customerId: number;
    customerName: string;
    phone: string;
    customerType: string;

    constructor(customerId: number, customerName: string, phone: string, customerType: string) {
      this.customerId = customerId;
      this.customerName = customerName;
      this.phone = phone;
      this.customerType = customerType;
    }
  }
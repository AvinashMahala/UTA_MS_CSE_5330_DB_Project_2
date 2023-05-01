export class Owner {
    ownerId: number;
    ownerType: string;
    name: string;
    bankName: string;
  
    constructor(ownerId: number, ownerType: string, name: string, bankName: string) {
      this.ownerId = ownerId;
      this.ownerType = ownerType;
      this.name = name;
      this.bankName = bankName;
    }
  }
  
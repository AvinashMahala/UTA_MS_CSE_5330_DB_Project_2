export class CarType {
    typeId: number;
    typeName: string;
    dailyRate: number;
    weeklyRate: number;
    luxuryFlag: string;
  
    constructor(typeId: number, typeName: string, dailyRate: number, weeklyRate: number, luxuryFlag: string) {
      this.typeId = typeId;
      this.typeName = typeName;
      this.dailyRate = dailyRate;
      this.weeklyRate = weeklyRate;
      this.luxuryFlag = luxuryFlag;
    }
  }
  
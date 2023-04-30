import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { CarType } from "../models/CarType";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit){
    const response = await fetch(input, init);
    if(response.ok){
        return response;
    }
    else{
        const errorBody=await response.json();
        const errorMessage=errorBody.error;

        if(response.status===401){
            throw new UnauthorizedError(errorMessage);
        }
        else if(response.status===409){
            throw new ConflictError(errorMessage);
        }
        else{
            throw Error("Request failed with status: "+response.status+" message: "+errorMessage);
        }

    }
}

export async function fetchCarTypes(): Promise<CarType[]>{
    const response=await fetchData("/api/cartype/",{method:"GET"});
    
    return response.json();
}



export interface CarTypeInput{
    typeId: number;
    typeName: string;
    dailyRate: number;
    weeklyRate: number;
    luxuryFlag: string;
}

export async function createCarType(carType: CarTypeInput):Promise<CarType>{
    const response = await fetchData("/api/cartype",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(carType),
    });
    return response.json();
}


export async function updateCarType(carTypeId: number, carType: CarTypeInput): Promise<CarType>{
    const response = await fetchData("/api/cartype/"+carTypeId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(carType),
    });
    return carType;
}



export async function deleteCarType(carTypeId: string){
    await fetchData("/api/cartype/"+carTypeId, {method: "DELETE"});
}

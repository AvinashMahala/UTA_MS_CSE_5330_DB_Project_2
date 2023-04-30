import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { CarAvailability } from "../models/CarAvailability";
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

export async function fetchCarAvailability(): Promise<CarAvailability[]>{
    const response=await fetchData("/api/caravailability/",{method:"GET"});
    
    return response.json();
}



export interface CarAvailabilityInput{
    availabilityId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
}

export async function createCarAvailability(carAvailability: CarAvailabilityInput):Promise<CarAvailability>{
    const response = await fetchData("/api/caravailability",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(carAvailability),
    });
    return response.json();
}


export async function updateCarAvailability(carAvailabilityId: number, carAvailability: CarAvailability): Promise<CarAvailability>{
    const response = await fetchData("/api/caravailability/"+carAvailabilityId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(carAvailability),
    });
    return carAvailability;
}



export async function deletecarAvailability(carAvailabilityId: string){
    await fetchData("/api/caravailability/"+carAvailabilityId, {method: "DELETE"});
}
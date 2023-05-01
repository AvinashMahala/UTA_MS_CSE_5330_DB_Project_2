import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Car } from "../models/Car";
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

export async function fetchCar(): Promise<Car[]>{
    const response=await fetchData("/api/car/",{method:"GET"});
    
    return response.json();
}



export interface CarInput{
    vehicleId: number;
    model: string;
    year: number;
    typeId: number;
    ownerId: number;
}

export async function createCar(car: CarInput):Promise<Car>{
    const response = await fetchData("/api/car",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(car),
    });
    return response.json();
}


export async function updateCar(carId: number, car: Car): Promise<Car>{
    const response = await fetchData("/api/car/"+carId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(car),
    });
    return car;
}



export async function deleteCar(carId: string){
    await fetchData("/api/car/"+carId, {method: "DELETE"});
}
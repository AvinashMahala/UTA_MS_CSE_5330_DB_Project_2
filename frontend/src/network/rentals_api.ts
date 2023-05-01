import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Rental } from "../models/Rental";
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

export async function fetchRental(): Promise<Rental[]>{
    const response=await fetchData("/api/rental/",{method:"GET"});
    
    return response.json();
}



export interface RentalInput{
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

export async function createRental(rental: RentalInput):Promise<Rental>{
    const response = await fetchData("/api/rental",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(rental),
    });
    return response.json();
}


export async function updateRental(rentalId: number, rental: Rental): Promise<Rental>{
    const response = await fetchData("/api/rental/"+rentalId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(rental),
    });
    return rental;
}



export async function deleteRental(rentalId: string){
    await fetchData("/api/rental/"+rentalId, {method: "DELETE"});
}
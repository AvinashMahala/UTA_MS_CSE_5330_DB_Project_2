import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Customer } from "../models/Customer";
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

export async function fetchCustomers(): Promise<Customer[]>{
    const response=await fetchData("/api/customers/",{method:"GET"});
    
    return response.json();
}


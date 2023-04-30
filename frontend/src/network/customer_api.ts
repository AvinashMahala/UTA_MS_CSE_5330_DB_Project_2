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



export interface CustomerInput{
    idNo: number,
    name: string,
    phone: string,
}

export async function createCustomer(customer: CustomerInput):Promise<Customer>{
    const response = await fetchData("/api/customers",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(customer),
    });
    return response.json();
}


export async function updateCustomer(customerId: number, customer: CustomerInput): Promise<Customer>{
    const response = await fetchData("/api/customers/"+customerId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(customer),
    });
    return customer;
}



export async function deleteCustomer(customerId: string){
    await fetchData("/api/customers/"+customerId, {method: "DELETE"});
}

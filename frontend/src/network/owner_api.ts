import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Owner } from "../models/Owner";
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

export async function fetchOwner(): Promise<Owner[]>{
    const response=await fetchData("/api/owner/",{method:"GET"});
    
    return response.json();
}



export interface OwnerInput{
    ownerId: number,
    ownerType: string,
    name: string,
    bankName: string,
}

export async function createOwner(owner: OwnerInput):Promise<Owner>{
    const response = await fetchData("/api/owner",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(owner),
    });
    return response.json();
}


export async function updateOwner(ownerId: number, owner: Owner): Promise<Owner>{
    const response = await fetchData("/api/owner/"+ownerId,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(owner),
    });
    return owner;
}



export async function deleteOwner(ownerId: string){
    await fetchData("/api/owner/"+ownerId, {method: "DELETE"});
}
export function formatDate(dateString:string):string{
    return new Date(dateString).toLocaleString("en-US",
    {
        year:"numeric",
        month: "short",
        day:"numeric",
        hour:"numeric",
        minute:"numeric",
    });
}


export function formatRentalType(rentalType:string):string{
    if(rentalType==="D"){
        return "Daily";
    }
    else if(rentalType==="W"){
        return "Weekly";
    }
    else if(rentalType==="M"){
        return "Monthly";
    }
    else{
        return "None";
    }
}

export function formatOwnerType(ownerType:string):string{
    if(ownerType==="I"){
        return "Individual";
    }
    else if(ownerType==="C"){
        return "Company";
    }
    else if(ownerType==="B"){
        return "Business";
    }
    else{
        return "None";
    }
}

export function formatNoOfDaysOrWeeks(noOfDaysOrWeeks:string):string{
    if(noOfDaysOrWeeks==="0" || noOfDaysOrWeeks===null || noOfDaysOrWeeks===undefined){
        return "None";
    }
    else{
        return noOfDaysOrWeeks;
    }
}

export function formatAmountDue(amountDue:string):string{
    if(amountDue==="0" || amountDue===null || amountDue===undefined){
        return "None";
    }
    else{
        return "$"+amountDue;
    }
}

export function formatRates(rates:string):string{
    if(rates==="0" || rates===null || rates===undefined){
        return "None";
    }
    else{
        return "$"+rates;
    }
}

export function luxuryFlag(luxuryFlag:string):string{
    if(luxuryFlag==="Y"){
        return "Yes";
    }
    else if(luxuryFlag==="N"){
        return "No";
    }
    else{
        return "None";
    }
}
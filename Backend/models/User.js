const mongoose= require("mongoose")

const userschema= new mongoose.Schema({
    profile_pic:{
        type:string,
    },
    first_name:{
        type:string,
        required:true,
    },
    last_name:{
        type:string,
        required:true,
    },
    userid:{
        type:string,
        require:true,
    },
    email:{
        type:string,
        required:true,
    },
    phone:{
        type:number,
        required:true,
    },
    dob:{
        type:string,
        
    },
    gender:{
        type:string,
        required:true,
    },
    country:{
        type:string,
       
    },
    city:{
        type:string,
        
    },
    password:{
        type:string,
        required:true,
    },
    


});

const User = mongoose.models.User || mongoose.model("User",userschema)
export default User
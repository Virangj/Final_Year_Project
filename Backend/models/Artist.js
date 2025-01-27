const mongoose= require("mongoose")

const Artistschema= new mongoose.Schema({
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
        required:true,
    },
    gender:{
        type:string,
        required:true,
    },
    country:{
        type:string,
        required:true,
    },
    city:{
        type:string,
        required:true,
    },
    password:{
        type:string,
        required:true,
    },
    artistid:{
        type:string,
        require:true,
    },
    


});

const Artist = mongoose.models.Artist || mongoose.model("Artist",Artistschema)
export default Artist
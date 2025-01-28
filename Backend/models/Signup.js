const mongoose= require("mongoose")

const signupschema= new mongoose.Schema({
    first_name:{
        type:string,
        required:true,
    },
    last_name:{
        type:string,
        required:true,
    },
    username:{
         type:string,
         required:true,
    },
    email:{
        type:string,
        required:true,
    },
     user_type:{
        type:string,
        required:true,
    },
    password:{
        type:string,
        required:true,
    },
    
    


});

const Signup = mongoose.models.Signup || mongoose.model("Signup",signupschema)
export default Signup
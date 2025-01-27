const mongoose= require("mongoose")

const postschema= new mongoose.Schema({
    title:{
        type:string,
        required:true,
    },
    description:{
        type:string,
        required:true,
    },
    image:{
        type:string,
        required:true,
    },
   like:{
        type:number,
        
    },
    comment:{
        type:string,
        
    },
    username:{
        type:string,
        require:true
    },
    userid:{
        type:string,
        
    },
    artistid:{
        type:string,
        require:true
    },
   
});

const Post = mongoose.models.Post || mongoose.model("Post",postschema)
export default Post
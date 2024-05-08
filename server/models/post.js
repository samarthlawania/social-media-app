import mongoose ,{Schema} from 'mongoose';


const postSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    desc:{  //description
        type:String,
        required:true
    },
    img:{  //image
        type:String,
    },
    likes:{
        type:String,
    },
    Comments:{
        type: Schema.Types.ObjectId,
        ref:"Comments"
    }
},{timestamps:true})


const Posts = mongoose.model("Posts",postSchema);

export default Posts;
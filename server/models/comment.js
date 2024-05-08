import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    userId:{type: Schema.Types.ObjectId,ref:"Users"},
    postId:{type: Schema.Types.ObjectId,ref:"Post"},
    Comment:{type:String,required:true},
    from:{type:String,required:true},
    reply:[
        {
            rid:{type: Schema.Types.ObjectId},
            userId:{type: Schema.Types.ObjectId,ref:"Users"},
            postId:{type: Schema.Types.ObjectId,ref:"Post"},
            Comment:{type:String,required:true},
            from:{type:String,required:true},
            replyAt:{type:String},
            createdAt:{type:DATE,default:Date.now()},
            updatedAt:{type:DATE,default:Date.now()},
            likes:[{type:String}]
        }

    ],
    likes:[{type:String}]
},{timestamps:true})



const Comment = mongoose.model("Comment",commentSchema);

export default Comment;
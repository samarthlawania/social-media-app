import mongoose,{Schema} from 'mongoose';

const friendrequest = new Schema({
    requestTo:{type: Schema.Types.ObjectId,ref:"Users"},
    requestFrom:{type: Schema.Types.ObjectId,ref:"Users"},
    requestStatus:{type:String,default:"pending"},
},{timestamps:true})


const FriendRequest = mongoose.model("friendrequest",friendrequest);

export default FriendRequest;

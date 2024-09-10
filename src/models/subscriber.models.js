import mongoose ,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
subscriber:{
    type:Schema.Types.ObjectId, // Onwe who is subscribing
    "ref":"User",

},
subscriber:{
    type:Schema.Types.ObjectId, // Onwe whom 'subscriber' is subscribing
    "ref":"User",

}

},
{
    timestamps:true
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    docID:{
        type:String,
        require:true
    },
    slotDate:{
        type:String,
        require:true
    },
    SlotTime:{
        type:String,
        require:true
    },
    userDAta:{
        type:Object,
        require:true
    },
    docData:{
        type:Object,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    date:{
        type:Number,
        require:true
    },
    cancelled:{
        type:Boolean,
        default:false
    },
    payment:{
        type:Boolean,
        default:false
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

const UserAppointment = mongoose.model('UserAppointment',appointmentSchema)

export {UserAppointment}
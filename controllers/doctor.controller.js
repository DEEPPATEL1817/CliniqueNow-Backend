import { Doctor } from "../models/doctor.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserAppointment } from "../models/appointment.model.js"

const changeAvailablity = async (req,res) => {
    try {
        const {docId} = req.docId
        
        const docData = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId,{available: !docData.available })
        res.status(200).json({message:"Availibilty is changed"})


    } catch (error) {
        console.log(error)
        res.status(400).json({messagae:"doctor conroller is not working"})
    }
}

const doctorList = async (req,res) => {
    try {
        const doctors = await Doctor.find({}).select(['-password' , '-email'])
        res.status(200).json({message:"doctors lists",doctors})

        console.log("all doctors ",doctors)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"get all doctors list is failed",error})
    }
}

//api for doctor login

const loginDoctor = async (req, res) => {
    try {
        const {email , password} = req.body

        const doctor = await Doctor.findOne({email})

        if(!doctor){
            return res.status(300).json({message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const doctorToken = jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            res.status(200).json({message:"doctor token is genereated", doctorToken})
        }
        else{
            res.status(400).json({message:"Error: Doctor token is not generated"})
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Doctor Login is failed",error})
    }
}

//api to get doctor appointment for doctor panel 
const appointmentsDoctor = async ( req, res)=> {
    try {
        const {docId} = req.docId
        console.log("docID in appointmentDoctor:",docId)

        if(!docId){
            console.log("docId is not fetched")
            return res.status(301).json({message:"docId is not fetched"})
        }
        console.log("doctor id is correctly fetched",docId)
        
        const appointments = await UserAppointment.find({docId})

        res.status(200).json({message:"All appointment:",appointments})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Doctor all appointment  is failed to fetch",error})
    }
}

// api to mark appointment completed for doctor panel 
const appointmentComplete = async() => {
    try {
        const {docId, appointmentId} = req.body

        const appointmentData = await UserAppointment.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            
            await UserAppointment.findByIdAndUpdate(appointmentId,{isCompleted: true})

            return res.status(200).json({message:"Appointment completed"})
        } else{
            return res.status(400).json({message:"Mark Failed"})
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Doctor  appointment mark  is not working ",error})
    }
}


//api to cancel the appointment for the doctor

const appointmentCancel = async() => {
    try {
        const {docId, appointmentId} = req.body

        const appointmentData = await UserAppointment.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            
            await UserAppointment.findByIdAndUpdate(appointmentId,{cancelled: true})

            return res.status(200).json({message:"Appointment Cancelled"})
        } else{
            return res.status(400).json({message:"Cancellation of user appointment by doctor is Failed"})
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Doctor  appointment mark  is not working ",error})
    }
}

export{
    changeAvailablity , 
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel

}
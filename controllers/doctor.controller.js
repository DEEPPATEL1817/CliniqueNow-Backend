import { Doctor } from "../models/doctor.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const changeAvailablity = async (req,res) => {
    try {
        const {docId} = req.body
        
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

export{
    changeAvailablity , 
    doctorList,
    loginDoctor

}
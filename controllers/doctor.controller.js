import { Doctor } from "../models/doctor.model.js"

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

export{changeAvailablity , doctorList}
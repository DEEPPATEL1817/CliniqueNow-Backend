//api for register new user
import validator from 'validator'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import { Doctor } from '../models/doctor.model.js'
import { UserAppointment } from '../models/appointment.model.js'
import Razorpay from 'razorpay'


const registerUser = async (req , res) =>{
    try {
        const {name, email, password} = req.body

        if ([name,email, password].some((field)=> field?.trim() === "")) {
            return res.status(400).json({message:"Missing Details"})
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({message:"Enter a valid email"})
        }

        if (password.length < 8) {
            return res.status(400).json({message:"Please enter a Strong password"})
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"Email is already registered"})
        }

        //hashing the user password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = await User.create({
            name,
            email,
            password:hashedPassword,
    })
    const token = jwt.sign({id:userData._id},process.env.JWT_SECRET)

    return res.status(201).json({message:"User registered successfully",token})

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
}

const userLogin = async (req,res) => {
    try {
        const {email,password} = req.body
        console.log("recieved playoad from frontend",email,password)

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message:"User does not exist"})
        }

        //matching password of user 
        const isPassword = await bcrypt.compare(password,user.password)

        if (isPassword) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN})
            return res.status(200).json({message:"Welcome",token})
        }else{
            return res.status(400).json({message:"Invalid Credentials"})
        }


    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Server error : Please try again later." });
    }
}

//api to get user profile data from frontend

const getProfile = async (req , res) => {
    try {
        const userId  = req.user
        console.log("user id received",userId)

        if (!userId) {
            return res.status(400).json({ message: "User ID missing" });
          }

        const userData = await User.findById(userId).select('-password')

        if (!userData) {
            return res.status(404).json({message:"user not found "})
        }
        return res.status(200).json({mesage:"success",userData})
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: getting user data Please try again later." });
    }
}

//api to update user profile
//userID
//taking user credential 
//image
//empty not 
//upload on cloudinary 

const updateUserProfile = async (req, res) =>{
    try {
        const { name ,phone ,dob,gender,address } = req.body

        const userId = req.user;

        console.log("userdata",userId , name ,phone ,dob,gender,address)
       
        const imageFile = req.file

        console.log("image of" , imageFile)


        if([name ,phone ,dob,gender].some((text) => text?.trim() === "")){
            return res.status(400).json({message:"Data missing"})
        }

        await User.findByIdAndUpdate(userId,{name,phone,address,dob,gender})

        console.log("this is address after update",address)
        if (imageFile) {
            
            const imageUpload = await uploadOnCloudinary(imageFile.path)

            const imageUrl = imageUpload.secure_url

            await User.findByIdAndUpdate(userId,{image:imageUrl})
        }

        return res.status(200).json({message:"user profile is updated successfully"})

        
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: Updating user data.Please try again later." });
    }
}

//api for booking appointment 

//user login 
//doc available 
//

const bookAppointment = async (req, res) => {
    try {
        console.log("body che :",req.body)
        console.log("user id che " , req.userId)
        const {docId, slotDate, slotTime} = req.body
        const userId = req.user
        console.log("data of bookappointment",docId, slotDate, slotTime,userId)
        //  console.log("userID of bookapp",userId)
         

        const docData = await Doctor.findById(docId).select('-password')

        console.log("doctors data while booking",docData)

        if(!docData.available){
            return res.status(401).json({message:"Doctor is not available"})
        }

        let slots_booked = docData.slots_booked ; // Ensure it's initialized as an empty object if not present


        //checking for slot availability

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.status(400).json({message: "This slot is already booked for this doctor"});
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
            
        }

        const userData = await User.findById(userId).select('-password')

        console.log("data of user after booking",userData)
        
        delete docData.slots_booked

        const NewAppointmentData = await UserAppointment.create({
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        })

        await NewAppointmentData.save()

        //save new slots data in docData

        await Doctor.findByIdAndUpdate(docId,{slots_booked})

        res.status(200).json({message:"you have successfully book the appointment"})

    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: Booking an appointment.Please try again later." });
    }
}

//api to get all user appointments 

const allAppointments = async (req , res) => {
    try {
        const userId = req.user
        const appointments = await UserAppointment.find({userId})

        console.log("appointment data",appointments)
        res.status(200).json({message:"Here is your all appointment ",appointments})
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: In listing Appointments.Please try again later." });
    }
}

//api to cancel appoinments
// user should be login 
// id of Doctor
// id of appointment

const cancelAppointment = async (req , res ) => {

    try {
        // console.log("cancellll:",userId,appointmentId)
        const { appointmentId} = req.body
        const userId = req.user
        console.log("ddddddddddd:",userId,appointmentId)

        const appoinmentData = await UserAppointment.findById(appointmentId)
        console.log( "Appointment data is required." ,appoinmentData);

        //verify appointment user 
        if(appoinmentData.userId !== userId){
            return res.status(400).json({message:"Unauthorized action !"})
        }

        await UserAppointment.findByIdAndUpdate(appointmentId,{cancelled:true})

        //after cancelling the appointment then time slot should be free

        const {docId,slotDate,slotTime} = appoinmentData

        const doctorData = await Doctor.findById(docId)

        const slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter( e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId,{slots_booked})

        res.status(200).json({message:"Appointment Canncelled"})
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: In Cancelling Appointments.Please try again later." });
    }
}

//api to make payment using razorpay

// const razorPayInstance = new Razorpay({
//     key_id:'',
//     key_secret:''
// })

// const paymentRazorPay =  async(req ,res) =>{

// }

export {
    registerUser,
    userLogin,
    getProfile,
    updateUserProfile,
    bookAppointment,
    allAppointments,
    cancelAppointment
}
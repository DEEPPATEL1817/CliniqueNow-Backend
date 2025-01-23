//api for register new user
import validator from 'validator'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from '../config/cloudinary.js'

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

export {
    registerUser,
    userLogin,
    getProfile,
    updateUserProfile,
}
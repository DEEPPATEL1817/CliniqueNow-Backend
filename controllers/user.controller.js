//api for register new user
import validator from 'validator'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

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

        const user = await User.findOne({email})

        if (!user) {
            res.status(400).json({message:"User does not exist"})
        }

        //matching password of user 
        const isPassword = await bcrypt.compare(password,user.password)

        if (isPassword) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN})
            res.status(200).json({message:"password is correct and the token is :",token})
        }else{
            res.status(400).json({message:"Invalid Credentials"})
        }


    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
}

export {
    registerUser,
    userLogin,
}
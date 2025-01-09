// API for adding new doctor 

import { BodyMixin } from "undici-types"

const addDoctor = async (req,res) => {
    try {
        const {name,email,password,speciality,degree,experience,about ,fees,address} = req.body
        
        
    } catch (error) {
        
    }
}

export {addDoctor}
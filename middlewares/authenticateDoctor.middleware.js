import jwt from 'jsonwebtoken'


//doctor authentication middleware 

const authDoctor = async (req,res,next) =>{
    try {
        const{token : doctorToken} = req.headers.doctorToken
       
        if(!doctorToken){
            
            return res.status(401).json({message:"Not authorized"})
        }
        

        const decodeToken = jwt.verify(doctorToken, process.env.JWT_SECRET)
        console.log("decodeToken",decodeToken)
        
        req.doctor = decodeToken.id
        console.log("decode doctor ID :",req.doctor)
       
        next()
    } catch (error) {
        return res.status(401).json({message:"Authenticatin fail"})
    }
}

export {authDoctor}
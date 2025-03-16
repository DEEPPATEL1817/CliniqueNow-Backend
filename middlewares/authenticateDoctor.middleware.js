import jwt from 'jsonwebtoken'

//Doctor authentication middleware 

const authDoctor = async (req,res,next) =>{
    try {
        const  doctorToken = req.headers.doctortoken ;
        console.log("token form headers is recieve in backend:",doctorToken)
       
        if(!doctorToken){
            
            return res.status(401).json({message:"Not authorized"})
        }
        

        const decodeToken = jwt.verify(doctorToken, process.env.JWT_SECRET)
        console.log("decodeToken",decodeToken)
        
        req.docId = decodeToken.id
        console.log("decode doctor ID :",req.docId)
       
        next()
    } catch (error) {
        return res.status(401).json({message:"Authentication fail"})
    }
}

export {authDoctor}
import jwt from 'jsonwebtoken'

//user authentication middleware 

const authUser = async (req,res,next) =>{
    try {
        const{token : adminToken} = req.headers
       
        if(!adminToken){
            
            return res.status(401).json({message:"Not authorized"})
        }
        

        const decodeToken = jwt.verify(adminToken, process.env.JWT_SECRET)
        console.log("decodeToken",decodeToken)
        
        req.user = decodeToken.id
        console.log("decode user ID :",req.user)
       
        next()
    } catch (error) {
        return res.status(401).json({message:"Authenticatin fail"})
    }
}

export {authUser}
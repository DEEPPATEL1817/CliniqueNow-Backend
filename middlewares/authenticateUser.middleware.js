import jwt from 'jsonwebtoken'

//user authentication middleware 

const authUser = async (req,res,next) =>{
    try {
        const{token : adminToken} = req.headers
       
        if(!token){
            
            return res.status(401).json({message:"Not authorized"})
        }
        

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decodeToken",decodeToken)
        
        req.body.userId = decodeToken.id
       
        next()
    } catch (error) {
        return res.status(401).json({message:"Authenticatin fail"})
    }
}

export {authUser}
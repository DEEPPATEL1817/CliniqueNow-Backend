import jwt from 'jsonwebtoken'

//admin authentication middleware 

const authAdmin = async (req,res,next) =>{
    try {
        const{admintoken : adminToken} = req.headers
       
        if(!adminToken){
            
            return res.status(401).json({message:"Not authorized"})
        }
        

        const decodeToken = jwt.verify(adminToken, process.env.JWT_SECRET)
        console.log("decodeToken",decodeToken)

        if(decodeToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD )
        {
            return res.status(401).json({message:"Not authorized.Login again"})
        }
        next()
    } catch (error) {
        return res.status(401).json({message:"Authenticatin fail"})
    }
}

export {authAdmin}
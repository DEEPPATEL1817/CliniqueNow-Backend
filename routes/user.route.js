import express from 'express'

import { registerUser ,userLogin, getProfile} from '../controllers/user.controller.js'
import { authUser } from '../middlewares/authenticateUser.middleware.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',userLogin)
userRouter.get('/get-profile',authUser,getProfile)

export {userRouter}
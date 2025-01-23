import express from 'express'

import { registerUser ,userLogin, getProfile, updateUserProfile} from '../controllers/user.controller.js'
import { authUser } from '../middlewares/authenticateUser.middleware.js'
import { upload } from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',userLogin)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser , updateUserProfile)

export {userRouter}
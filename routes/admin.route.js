import express from 'express'
import { addDoctor, adminLogin } from '../controllers/admin.controller.js'
import { upload } from '../middlewares/multer.js'
import { authAdmin } from '../middlewares/authenticateAdmin.middleware.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/admin-login', adminLogin);

adminRouter

export {adminRouter}
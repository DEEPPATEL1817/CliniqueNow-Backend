import express from 'express'
import { addDoctor, adminLogin, allDoctor } from '../controllers/admin.controller.js'
import { upload } from '../middlewares/multer.js'
import { authAdmin } from '../middlewares/authenticateAdmin.middleware.js'
import { changeAvailablity } from '../controllers/doctor.controller.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/admin-login', adminLogin);
adminRouter.post('/allDoctor',authAdmin ,allDoctor);
adminRouter.post('/change-availiability',authAdmin ,changeAvailablity);

adminRouter

export {adminRouter}
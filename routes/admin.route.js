import express from 'express'
import { addDoctor, adminLogin, allDoctor, appointmentAdmin, appointmentCancel, adminDashBoard } from '../controllers/admin.controller.js'
import { upload } from '../middlewares/multer.js'
import { authAdmin } from '../middlewares/authenticateAdmin.middleware.js'
import { changeAvailablity } from '../controllers/doctor.controller.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/admin-login', adminLogin);
adminRouter.post('/allDoctor',authAdmin ,allDoctor);
adminRouter.post('/change-availiability',authAdmin ,changeAvailablity);
adminRouter.get('/appointments',authAdmin ,appointmentAdmin);
adminRouter.post('/cancel-appointment',authAdmin ,appointmentCancel);
adminRouter.get('/dashboard',authAdmin ,adminDashBoard);

adminRouter

export {adminRouter}
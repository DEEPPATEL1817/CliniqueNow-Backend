import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, updateDoctorProfile, doctorProfile } from '../controllers/doctor.controller.js'
import { authDoctor } from '../middlewares/authenticateDoctor.middleware.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/doctor-appointments',  authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor,appointmentCancel)
doctorRouter.get('/dashboard', authDoctor,doctorDashboard)
doctorRouter.get('/profile', authDoctor,doctorProfile)
doctorRouter.post('/update-profile', authDoctor,updateDoctorProfile)

export {doctorRouter}
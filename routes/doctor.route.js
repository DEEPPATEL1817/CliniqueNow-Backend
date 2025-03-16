import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard } from '../controllers/doctor.controller.js'
import { authDoctor } from '../middlewares/authenticateDoctor.middleware.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/doctor-appointments', authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor,appointmentCancel)
doctorRouter.get('/dashboard', authDoctor,doctorDashboard)

export {doctorRouter}
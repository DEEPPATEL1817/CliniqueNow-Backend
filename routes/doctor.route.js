import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor, appointmentComplete, appointmentCancel } from '../controllers/doctor.controller.js'
import { authDoctor } from '../middlewares/authenticateDoctor.middleware.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.get('/cancel-appointment', authDoctor,appointmentCancel)

export {doctorRouter}
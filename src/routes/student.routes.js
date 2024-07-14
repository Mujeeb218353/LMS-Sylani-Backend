import { Router } from 'express'
import {
    registerStudent,
    loginStudent,
    logoutStudent,
    getCurrentStudent,
    refreshStudentAccessToken,
} from '../controllers/student.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyStudentJWT } from '../middlewares/student.auth.middleware.js'
import { enrollStudent } from '../controllers/enrollment.controllers.js'

const router = Router()

router.route('/register').post(upload.single('profile'), registerStudent)

router.route('/login').post(loginStudent)

// secure routes
router.route('/logout').post(verifyStudentJWT, logoutStudent)
router.route('/getCurrentStudent').get(verifyStudentJWT, getCurrentStudent)
router.route('/refreshStudentAccessToken').post(verifyStudentJWT, refreshStudentAccessToken)

router.route('/enrollStudent').post(verifyStudentJWT, enrollStudent)

export default router
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
import { getStudentClass } from '../controllers/class.controllers.js'
import { submitAssignment, getUnSubmittedAssignment, getSubmittedAssignment } from '../controllers/assignment.controllers.js'

const router = Router()

router.route('/register').post(upload.single('profile'), registerStudent)

router.route('/login').post(loginStudent)

// secure routes
router.route('/logout').post(verifyStudentJWT, logoutStudent)
router.route('/getCurrentStudent').get(verifyStudentJWT, getCurrentStudent)
router.route('/refreshStudentAccessToken').post(verifyStudentJWT, refreshStudentAccessToken)

router.route('/enrollStudent').post(verifyStudentJWT, enrollStudent)
router.route('/getStudentClass').get(verifyStudentJWT, getStudentClass)

router.route('/submitAssignment').post(verifyStudentJWT, submitAssignment)
router.route('/getUnSubmittedAssignment').get(verifyStudentJWT, getUnSubmittedAssignment)
router.route('/getSubmittedAssignment').get(verifyStudentJWT, getSubmittedAssignment)

export default router
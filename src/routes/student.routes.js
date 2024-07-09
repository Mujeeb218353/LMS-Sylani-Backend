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

const router = Router()

router.route('/register').post(upload.single('profile'),registerStudent)

router.route('/login').post(loginStudent)

// secure routes
router.route('/logout').post(verifyStudentJWT, logoutStudent)
router.route('/getCurrentStudent').get(verifyStudentJWT, getCurrentStudent)
router.route('/refreshStudentAccessToken').post(verifyStudentJWT, refreshStudentAccessToken)

export default router
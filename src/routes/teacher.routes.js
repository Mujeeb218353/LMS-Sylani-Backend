import { Router } from 'express'
import { 
    registerTeacher, 
    loginTeacher, 
    logoutTeacher,
    getCurrentTeacher,
    refreshTeacherAccessToken,
} from '../controllers/teacher.controller.js'
import { verifyTeacherJWT } from '../middlewares/teacher.auth.middleware.js'

const router = Router()

router.route('/register').post(registerTeacher);

router.route('/login').post(loginTeacher)

// secure routes
router.route('/logout').post(verifyTeacherJWT, logoutTeacher)
router.route('/getCurrentTeacher').get(verifyTeacherJWT, getCurrentTeacher)
router.route('/refreshTeacherAccessToken').get(verifyTeacherJWT, refreshTeacherAccessToken);

export default router
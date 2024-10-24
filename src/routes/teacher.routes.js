import { Router } from 'express'
import { 
    registerTeacher, 
    loginTeacher, 
    logoutTeacher,
    getCurrentTeacher,
    refreshTeacherAccessToken,
} from '../controllers/teacher.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyTeacherJWT } from '../middlewares/teacher.auth.middleware.js'
import { 
    createAssignment,
    getCreatedAssignment,
    editAssignment,
    deleteAssignment,
    getStudentsSubmittedAssignment,
    getStudentsNotSubmittedAssignment,
    assignMarks,
} from '../controllers/assignment.controllers.js'

const router = Router()

router.route('/register').post(upload.single('profile'), registerTeacher);

router.route('/login').post(loginTeacher)

// secure routes
router.route('/logout').post(verifyTeacherJWT, logoutTeacher)
router.route('/getCurrentTeacher').get(verifyTeacherJWT, getCurrentTeacher)
router.route('/refreshTeacherAccessToken').get(verifyTeacherJWT, refreshTeacherAccessToken)

router.route('/createAssignment').post(verifyTeacherJWT, createAssignment)
router.route('/getCreatedAssignments').get(verifyTeacherJWT, getCreatedAssignment)
router.route('/editAssignment/:assignmentId').put(verifyTeacherJWT, editAssignment)
router.route('/deleteAssignment/:assignmentId').delete(verifyTeacherJWT, deleteAssignment)
router.route('/getStudentsSubmittedAssignment/:assignmentId').get(verifyTeacherJWT, getStudentsSubmittedAssignment)
router.route('/getStudentsNotSubmittedAssignment/:assignmentId').get(verifyTeacherJWT, getStudentsNotSubmittedAssignment)
router.route('/assignMarks/:assignmentId').put(verifyTeacherJWT, assignMarks)

export default router
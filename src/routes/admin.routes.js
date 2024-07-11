import { Router } from 'express'
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    refreshAdminAccessToken,
} from '../controllers/admin.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyAdminJWT } from '../middlewares/admin.auth.middleware.js'

const router = Router()

router.route('/register').post(upload.single('profile'), registerAdmin)

router.route('/login').post(loginAdmin)

// secure routes
router.route('/logout').post(verifyAdminJWT, logoutAdmin)
router.route('/getCurrentAdmin').get(verifyAdminJWT, getCurrentAdmin)
router.route('/refreshAdminAccessToken').post(verifyAdminJWT, refreshAdminAccessToken)

export default router
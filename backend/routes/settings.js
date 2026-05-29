const express = require('express')
const router = express.Router()
const controller = require('../controllers/settingsController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/thresholds', authMiddleware, authorizeRole(PERMISSIONS.VIEW_SETTINGS), controller.get)
router.put('/thresholds', authMiddleware, authorizeRole(PERMISSIONS.EDIT_THRESHOLDS), controller.update)

module.exports = router

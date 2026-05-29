const express = require('express')
const router = express.Router()
const controller = require('../controllers/logController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/', authMiddleware, authorizeRole(PERMISSIONS.VIEW_LOGS), controller.list)
router.delete('/', authMiddleware, authorizeRole(PERMISSIONS.DELETE_LOGS), controller.clear)

module.exports = router

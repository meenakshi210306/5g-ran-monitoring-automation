const express = require('express')
const router = express.Router()
const controller = require('../controllers/alertController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/', authMiddleware, authorizeRole(PERMISSIONS.VIEW_DASHBOARD), controller.list)

module.exports = router

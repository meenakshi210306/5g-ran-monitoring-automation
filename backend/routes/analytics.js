const express = require('express')
const router = express.Router()
const controller = require('../controllers/analyticsController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/', authMiddleware, authorizeRole(PERMISSIONS.VIEW_ANALYTICS), controller.summary)

module.exports = router

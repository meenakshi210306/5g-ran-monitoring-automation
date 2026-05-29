const express = require('express')
const router = express.Router()
const controller = require('../controllers/nodeController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/', controller.list)
router.post('/:id/restart', authMiddleware, authorizeRole(PERMISSIONS.RESTART_NODE), controller.restart)

module.exports = router

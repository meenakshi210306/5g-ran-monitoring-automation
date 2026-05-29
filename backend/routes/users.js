const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/authorizeRole')
const { PERMISSIONS } = require('../utils/rbac')

router.get('/', authMiddleware, authorizeRole(PERMISSIONS.MANAGE_USERS), controller.list)

module.exports = router

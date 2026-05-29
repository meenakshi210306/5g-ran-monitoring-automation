const PERMISSIONS = {
  VIEW_DASHBOARD: 'view:dashboard',
  VIEW_TOPOLOGY: 'view:topology',
  VIEW_ANALYTICS: 'view:analytics',
  VIEW_LOGS: 'view:logs',
  VIEW_AUTOMATION: 'view:automation',
  VIEW_SETTINGS: 'view:settings',
  MANAGE_USERS: 'manage:users',
  RESTART_NODE: 'restart:node',
  DELETE_LOGS: 'delete:logs',
  EDIT_THRESHOLDS: 'edit:thresholds'
}

const ROLE_PERMISSIONS = {
  Admin: Object.values(PERMISSIONS),
  'Network Engineer': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TOPOLOGY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_AUTOMATION,
    PERMISSIONS.RESTART_NODE
  ],
  Viewer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TOPOLOGY,
    PERMISSIONS.VIEW_ANALYTICS
  ]
}

function hasPermission(role, permission){
  return (ROLE_PERMISSIONS[role] || []).includes(permission)
}

module.exports = { PERMISSIONS, ROLE_PERMISSIONS, hasPermission }

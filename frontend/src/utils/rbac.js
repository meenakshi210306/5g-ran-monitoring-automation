export const ROLES = {
  ADMIN: 'Admin',
  ENGINEER: 'Network Engineer',
  VIEWER: 'Viewer'
}

export const PERMISSIONS = {
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

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TOPOLOGY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_AUTOMATION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.RESTART_NODE,
    PERMISSIONS.DELETE_LOGS,
    PERMISSIONS.EDIT_THRESHOLDS
  ],
  [ROLES.ENGINEER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TOPOLOGY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_AUTOMATION,
    PERMISSIONS.RESTART_NODE
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TOPOLOGY,
    PERMISSIONS.VIEW_ANALYTICS
  ]
}

export const ROLE_NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { path: '/', label: 'Dashboard', permission: PERMISSIONS.VIEW_DASHBOARD },
    { path: '/topology', label: 'Topology', permission: PERMISSIONS.VIEW_TOPOLOGY },
    { path: '/analytics', label: 'Analytics', permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: '/logs', label: 'Logs', permission: PERMISSIONS.VIEW_LOGS },
    { path: '/automation', label: 'Automation', permission: PERMISSIONS.VIEW_AUTOMATION },
    { path: '/settings', label: 'Settings', permission: PERMISSIONS.VIEW_SETTINGS },
    { path: '/users', label: 'User Management', permission: PERMISSIONS.MANAGE_USERS }
  ],
  [ROLES.ENGINEER]: [
    { path: '/', label: 'Dashboard', permission: PERMISSIONS.VIEW_DASHBOARD },
    { path: '/topology', label: 'Topology', permission: PERMISSIONS.VIEW_TOPOLOGY },
    { path: '/analytics', label: 'Analytics', permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: '/logs', label: 'Logs', permission: PERMISSIONS.VIEW_LOGS },
    { path: '/automation', label: 'Automation', permission: PERMISSIONS.VIEW_AUTOMATION }
  ],
  [ROLES.VIEWER]: [
    { path: '/', label: 'Dashboard', permission: PERMISSIONS.VIEW_DASHBOARD },
    { path: '/topology', label: 'Topology', permission: PERMISSIONS.VIEW_TOPOLOGY },
    { path: '/analytics', label: 'Analytics', permission: PERMISSIONS.VIEW_ANALYTICS }
  ]
}

export function getRolePermissions(role){
  return ROLE_PERMISSIONS[role] || []
}

export function hasPermission(role, permission){
  return getRolePermissions(role).includes(permission)
}

export function canAccess(role, permission){
  return hasPermission(role, permission)
}

export function getVisibleNavItems(role){
  return ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS[ROLES.VIEWER]
}

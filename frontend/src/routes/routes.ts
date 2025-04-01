// Route definitions
export enum RouteKeys {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  BATCH = 'BATCH',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  NOT_FOUND = 'NOT_FOUND',
}

export interface RouteConfig {
  key: RouteKeys;
  path: string;
  title: string;
  isPrivate: boolean;
  isExact?: boolean;
  icon?: string;
  showInNav?: boolean;
  navLabel?: string;
}

export const ROUTES: Record<RouteKeys, RouteConfig> = {
  [RouteKeys.HOME]: {
    key: RouteKeys.HOME,
    path: '/',
    title: 'Home',
    isPrivate: false,
    isExact: true,
    icon: 'home',
    showInNav: true,
    navLabel: 'Home',
  },
  [RouteKeys.DASHBOARD]: {
    key: RouteKeys.DASHBOARD,
    path: '/dashboard',
    title: 'Dashboard',
    isPrivate: true,
    isExact: true,
    icon: 'dashboard',
    showInNav: true,
    navLabel: 'Dashboard',
  },
  [RouteKeys.ANALYSIS]: {
    key: RouteKeys.ANALYSIS,
    path: '/analyze',
    title: 'Sentiment Analysis',
    isPrivate: true,
    isExact: true,
    icon: 'analytics',
    showInNav: true,
    navLabel: 'New Analysis',
  },
  [RouteKeys.BATCH]: {
    key: RouteKeys.BATCH,
    path: '/batch',
    title: 'Batch Processing',
    isPrivate: true,
    isExact: true,
    icon: 'folder',
    showInNav: true,
    navLabel: 'Batch Process',
  },
  [RouteKeys.HISTORY]: {
    key: RouteKeys.HISTORY,
    path: '/history',
    title: 'Analysis History',
    isPrivate: true,
    isExact: true,
    icon: 'history',
    showInNav: true,
    navLabel: 'History',
  },
  [RouteKeys.SETTINGS]: {
    key: RouteKeys.SETTINGS,
    path: '/settings',
    title: 'Settings',
    isPrivate: true,
    isExact: true,
    icon: 'settings',
    showInNav: true,
    navLabel: 'Settings',
  },
  [RouteKeys.LOGIN]: {
    key: RouteKeys.LOGIN,
    path: '/login',
    title: 'Login',
    isPrivate: false,
    isExact: true,
    showInNav: false,
  },
  [RouteKeys.REGISTER]: {
    key: RouteKeys.REGISTER,
    path: '/register',
    title: 'Register',
    isPrivate: false,
    isExact: true,
    showInNav: false,
  },
  [RouteKeys.NOT_FOUND]: {
    key: RouteKeys.NOT_FOUND,
    path: '*',
    title: 'Not Found',
    isPrivate: false,
    showInNav: false,
  },
};

// Navigation items (filtered from ROUTES)
export const NAV_ITEMS = Object.values(ROUTES).filter(
  (route) => route.showInNav
);

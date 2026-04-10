import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/help', '/403', '/', '/api/auth', '/_next'];

const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'view:dashboard',
  '/dashboard/leads': 'view:leads',
  '/dashboard/opportunities': 'view:opportunities',
  '/dashboard/tasks': 'view:tasks',
  '/dashboard/tasks/assignments': 'view:tasks',
  '/dashboard/tasks/calendar': 'view:tasks',
  '/dashboard/tasks/reminders': 'view:tasks',
  '/dashboard/audit': 'view:audit',
  '/dashboard/reports': 'view:reports',
  '/dashboard/portal': 'view:portal',
  '/dashboard/users': 'manage:users',
  '/dashboard/messages': 'view:messages',
  '/dashboard/config': 'manage:settings',
  '/dashboard/invoices': 'view:invoices',
};

function getRequiredPermission(pathname: string): string | null {
  for (const [path, perm] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(path)) return perm;
  }
  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const sessionCookie = request.cookies.get('session_data');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const userPermissions: string[] = sessionData.permissions || [];

    const requiredPermission = getRequiredPermission(pathname);
    
    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

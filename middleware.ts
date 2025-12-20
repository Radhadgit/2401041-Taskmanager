import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '';

    // Define allowed origins (replace '*' with specific domains in production if needed)
    // For this fix, we allow all to solve the "different port" connection issue.
    const allowedOrigins = ['*'];

    // Check if the origin is allowed (or if we allow all)
    const isAllowedOrigin = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
        if (isAllowedOrigin) {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': origin || '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
        }
        return new NextResponse(null, { status: 400 });
    }

    // Handle simple requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};

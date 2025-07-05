import { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {

}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|map)).*)',
  ],
};

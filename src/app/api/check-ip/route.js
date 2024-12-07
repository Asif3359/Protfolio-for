import { NextResponse } from 'next/server';

export async function GET(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');
    
    return NextResponse.json({
        ip: ip || 'Unable to determine IP',
        headers: Object.fromEntries(request.headers)
    });
} 
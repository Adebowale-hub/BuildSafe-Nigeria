import { NextResponse } from 'next/server';
import { LandScraperService } from '@/services/scraper';

export async function POST() {
    try {
        const result = await LandScraperService.syncWithSupabase();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Use POST to sync lands' });
}

import { NextRequest,NextResponse } from 'next/server';
import { directoryReady,getLGAs,getWards,getPollingUnits } from '@/lib/electoral';
export const runtime='nodejs';
export async function GET(request:NextRequest){if(!directoryReady())return NextResponse.json({message:'Registration is currently unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}});
 const url=request.nextUrl.searchParams,lga=url.get('lga')||'',ward=url.get('ward')||'';
 if(lga&&!/^\d{2}$/.test(lga))return NextResponse.json({message:'Invalid local government selection'},{status:400});
 if(ward&&!/^\d{2}$/.test(ward))return NextResponse.json({message:'Invalid ward selection'},{status:400});
 if(ward&&!lga)return NextResponse.json({message:'Select an LGA first'},{status:400});
 return NextResponse.json(ward?{items:getPollingUnits(lga,ward)}:lga?{items:getWards(lga)}:{items:getLGAs()},{headers:{'Cache-Control':'public, max-age=3600'}});
}

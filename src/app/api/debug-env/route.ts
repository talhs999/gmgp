import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const keyMatch = process.env.SUPABASE_SERVICE_ROLE_KEY ? true : false;
  
  // Try to ping the URL to see if it resolves from Vercel
  let fetchStatus = "Not attempted";
  if (url && url !== "https://placeholder.supabase.co") {
      try {
          const res = await fetch(url + "/auth/v1/health", { method: "GET" });
          fetchStatus = "Success! " + res.status;
      } catch (e: any) {
          fetchStatus = "Failed: " + e.message;
      }
  }

  return NextResponse.json({ 
    url: url || 'undefined', 
    hasServiceKey: keyMatch,
    ping: fetchStatus
  });
}

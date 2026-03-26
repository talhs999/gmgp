import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = supabaseAdmin();
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
  
  if (userErr) return NextResponse.json({ error: userErr.message });
  
  const adminUser = users.users.find(u => u.email === 'admin@gmgp.com');
  if (!adminUser) return NextResponse.json({ error: "No admin user found in auth" });
  
  const { data: profile, error: profErr } = await supabase.from('profiles').select('*').eq('id', adminUser.id).single();
  
  // If profile doesn't exist, create it manually just in case trigger failed
  if (!profile) {
    const { error: insErr } = await supabase.from('profiles').insert({
      id: adminUser.id,
      full_name: 'GMGP Admin',
      is_admin: true
    });
    return NextResponse.json({ created: true, insErr });
  }

  // Force is_admin true
  if (!profile.is_admin) {
    await supabase.from('profiles').update({ is_admin: true }).eq('id', adminUser.id);
  }
  
  return NextResponse.json({ profile, forced: !profile.is_admin });
}

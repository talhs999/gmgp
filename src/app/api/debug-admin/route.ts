import { NextResponse } from 'next/server';

export async function GET() {
  // This route is disabled in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Only runs in development — kept for local admin setup debugging
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');
    const supabase = supabaseAdmin();
    const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
    
    if (userErr) return NextResponse.json({ error: userErr.message });
    
    const adminUser = users.users.find(u => u.email === 'admin@gmgp.com');
    if (!adminUser) return NextResponse.json({ error: "No admin user found in auth" });
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (!profile) {
      const { error: insErr } = await supabase.from('profiles').insert({
        id: adminUser.id,
        full_name: 'GMGP Admin',
        is_admin: true
      });
      return NextResponse.json({ created: true, insErr });
    }

    if (!profile.is_admin) {
      await supabase.from('profiles').update({ is_admin: true }).eq('id', adminUser.id);
    }
    
    return NextResponse.json({ profile, forced: !profile.is_admin });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

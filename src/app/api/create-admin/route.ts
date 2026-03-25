import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = supabaseAdmin();
    
    const email = 'admin@gmgp.com';
    const password = 'AdminPassword123!';

    // 1. Create or get user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    let userId = authData?.user?.id;

    if (authError) {
      if (authError.message.includes("already registered")) {
        const { data: users } = await supabase.auth.admin.listUsers();
        userId = users.users.find(u => u.email === email)?.id;
      } else {
        throw authError;
      }
    }

    if (!userId) throw new Error("Could not find or create user ID");

    // Wait for trigger
    await new Promise(r => setTimeout(r, 1500));

    // 2. Make them admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_admin: true, full_name: 'GMGP Admin' })
      .eq('id', userId);

    if (profileError) throw profileError;

    return NextResponse.json({ 
      success: true, 
      message: "Admin account ready!", 
      credentials: { email, password } 
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

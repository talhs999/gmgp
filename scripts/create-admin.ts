import { createClient } from "@supabase/supabase-js";
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL="(.*?)"/);
const serviceKeyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY="(.*?)"/);

if (!supabaseUrlMatch || !serviceKeyMatch) {
    throw new Error("Missing env vars in .env.local");
}

process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrlMatch[1];
process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKeyMatch[1];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("Creating admin account...");

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@gmgp.com',
    password: 'AdminPassword123!',
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("User already registered")) {
        console.log("User already exists! Getting user ID to make admin...");
        // Just find the user and make admin
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;
        const user = usersData.users.find(u => u.email === 'admin@gmgp.com');
        if (user) {
            console.log("Found user:", user.id);
            const { error: profileError } = await supabase
              .from("profiles")
              .update({ is_admin: true })
              .eq("id", user.id);
            
            if (profileError) console.error("Profile update error:", profileError.message);
            else console.log("Success! Updated existing user to admin.");
        }
    } else {
        console.error("Auth error:", error.message);
    }
    return;
  }

  const userId = data.user.id;
  console.log("User created! ID:", userId);

  // Wait a moment for trigger to create profile
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ 
        is_admin: true, 
        full_name: "GMGP Admin", 
        phone: "+92 300 1234567" 
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Profile update error:", profileError.message);
  } else {
    console.log("Success! Admin account created and updated.");
    console.log("Email: admin@gmgp.com");
    console.log("Password: AdminPassword123!");
  }
}

run();

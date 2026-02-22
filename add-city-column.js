require('dotenv').config();

async function addCityColumn() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Use Supabase Management API / pg_net or direct SQL endpoint
  const sqlQuery = "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';";
  
  try {
    // Try using the Supabase SQL endpoint (available via service role)
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({}),
    });

    // Alternative: use the pg endpoint directly  
    const sqlRes = await fetch(`${supabaseUrl}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: sqlQuery }),
    });

    if (sqlRes.ok) {
      console.log('City column added successfully via SQL endpoint!');
    } else {
      // Fallback: tell user to run it manually
      console.log('\nPlease run this SQL in your Supabase Dashboard > SQL Editor:\n');
      console.log(sqlQuery);
      console.log('\nAlso update the trigger:');
      console.log(`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data ->> 'city', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
    }
  } catch (e) {
    console.log('\nPlease run this SQL in your Supabase Dashboard > SQL Editor:\n');
    console.log(sqlQuery);
  }
}

addCityColumn();

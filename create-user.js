import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdminUser(email, password) {
  try {
    // Create the user
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      console.error('Error creating user:', authError.message);
      return;
    }

    console.log('User created:', user.user.email);

    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.user.id, role: 'admin' });

    if (roleError) {
      console.error('Error adding admin role:', roleError.message);
    } else {
      console.log('Admin role added successfully.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Usage: node create-user.js <email> <password>
const [,, email, password] = process.argv;

if (!email || !password) {
  console.log('Usage: node create-user.js <email> <password>');
  process.exit(1);
}

createAdminUser(email, password);
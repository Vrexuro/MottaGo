// supabase/functions/create-user/index.ts
// Edge Function — Create Utility User
// Called by Manajer only. Uses service_role key to create auth user.
// Trigger fn_handle_new_user (0011) auto-inserts the profile row.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── Step 1: Verify caller is authenticated ────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    // Create caller client (uses caller's JWT — RLS applies)
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const {
      data: { user },
      error: authError,
    } = await callerClient.auth.getUser()

    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    // ── Step 2: Verify caller is manajer ─────────────────────────────────────
    const { data: callerProfile, error: profileError } = await callerClient
      .from('profiles')
      .select('role, store_id')
      .eq('id', user.id)
      .single()

    if (profileError || !callerProfile) {
      return jsonResponse({ error: 'Profil tidak ditemukan' }, 403)
    }

    if (callerProfile.role !== 'manajer') {
      return jsonResponse({ error: 'Hanya Manajer yang dapat menambahkan pengguna' }, 403)
    }

    const storeId: number = callerProfile.store_id

    // ── Step 3: Parse and validate request body ───────────────────────────────
    let body: { username?: string; fullName?: string; password?: string }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'Request body tidak valid (harus JSON)' }, 400)
    }

    const { username, fullName, password } = body

    if (!username || !fullName || !password) {
      return jsonResponse({ error: 'username, fullName, dan password wajib diisi' }, 400)
    }

    // Validate username format: lowercase alphanumeric + underscore only
    if (!/^[a-z0-9_]+$/.test(username)) {
      return jsonResponse({
        error: 'Username hanya boleh huruf kecil, angka, dan underscore (_)',
      }, 400)
    }

    if (username.length < 3) {
      return jsonResponse({ error: 'Username minimal 3 karakter' }, 400)
    }

    if (password.length < 8) {
      return jsonResponse({ error: 'Password minimal 8 karakter' }, 400)
    }

    // ── Step 4: Create user with admin client (service_role) ──────────────────
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
      email: `${username}@mottago.internal`,
      password,
      email_confirm: true, // auto-confirm — username-based auth (DL-11), no email flow
      user_metadata: {
        username,
        full_name: fullName,
        role: 'utility',           // Always utility — Manajer cannot create another Manajer via app
        store_id: storeId,         // Same store as the calling Manajer
      },
    })

    if (createError) {
      // Surface common errors with friendly messages
      const msg = createError.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('unique')) {
        return jsonResponse({ error: 'Username sudah digunakan. Pilih username lain.' }, 409)
      }
      return jsonResponse({ error: createError.message }, 400)
    }

    // ── Step 5: Return new user info ─────────────────────────────────────────
    // Profile row is created automatically by fn_handle_new_user trigger (0011)
    return jsonResponse({
      id: newUserData.user.id,
      username,
      fullName,
      role: 'utility',
      storeId,
    }, 201)

  } catch (err) {
    console.error('create-user error:', err)
    return jsonResponse({ error: 'Terjadi kesalahan internal. Coba lagi.' }, 500)
  }
})

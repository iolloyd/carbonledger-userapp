/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  APP_URL: string;
}

interface EmailRequest {
  email: string;
}

interface EmailVerifyRequest {
  email: string;
  code: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

async function upsertUser(db: D1Database, userInfo: { email: string; name: string; picture: string | null }) {
  const { email, name, picture } = userInfo
  
  const result = await db.prepare(
    `INSERT INTO users (email, name, picture) 
     VALUES (?, ?, ?)
     ON CONFLICT (email) DO UPDATE SET
     name = excluded.name,
     picture = excluded.picture
     RETURNING *`
  )
  .bind(email, name, picture)
  .first<User>()
  
  if (!result) {
    throw new Error('Failed to create or update user')
  }
  
  return result
}

async function createSessionToken(user: User) {
  return btoa(JSON.stringify({
    userId: user.id,
    email: user.email,
    expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  }))
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      })
    }

    // Handle email authentication
    if (url.pathname === '/api/auth/email/request') {
      if (request.method === 'POST') {
        try {
          const { email } = await request.json() as EmailRequest
          
          if (!email) {
            return jsonResponse({ error: 'Email is required' }, 400)
          }

          // Generate a 6-digit code
          const code = Math.floor(100000 + Math.random() * 900000).toString()
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

          // Store the code
          await env.DB.prepare(`
            INSERT INTO verification_codes (email, code, expires_at)
            VALUES (?, ?, ?)
            ON CONFLICT (email) DO UPDATE SET
            code = excluded.code,
            expires_at = excluded.expires_at
          `).bind(email, code, expiresAt.toISOString()).run()

          // TODO: Send email with code
          // For development, log the code
          console.log('Verification code for', email, ':', code)

          return jsonResponse({ message: 'Verification code sent' })
        } catch (error) {
          console.error('Error sending verification code:', error)
          return jsonResponse({ error: 'Failed to send verification code' }, 500)
        }
      }
    }

    if (url.pathname === '/api/auth/email/verify') {
      if (request.method === 'POST') {
        try {
          const { email, code } = await request.json() as EmailVerifyRequest
          
          if (!email || !code) {
            return jsonResponse({ error: 'Email and code are required' }, 400)
          }

          // Verify the code
          const verificationResult = await env.DB.prepare(`
            SELECT * FROM verification_codes
            WHERE email = ?
            AND code = ?
            AND expires_at > datetime('now')
          `).bind(email, code).first()

          if (!verificationResult) {
            return jsonResponse({ error: 'Invalid or expired code' }, 400)
          }

          // Create or update user
          const user = await upsertUser(env.DB, {
            email,
            name: email.split('@')[0], // Use part before @ as name
            picture: null
          })

          // Generate session token
          const token = await createSessionToken(user)

          // Store session
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          await env.DB.prepare(`
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, ?)
          `).bind(user.id, token, expiresAt.toISOString()).run()

          // Delete used verification code
          await env.DB.prepare(`
            DELETE FROM verification_codes
            WHERE email = ?
          `).bind(email).run()

          return jsonResponse({ token, user })
        } catch (error) {
          console.error('Error verifying code:', error)
          return jsonResponse({ error: 'Failed to verify code' }, 500)
        }
      }
    }

    if (url.pathname === '/auth/validate') {
      if (request.method === 'GET') {
        try {
          const token = request.headers.get('Authorization')?.replace('Bearer ', '')
          
          if (!token) {
            return jsonResponse({ error: 'No token provided' }, 401)
          }

          const session = await env.DB.prepare(
            `SELECT users.* FROM sessions 
             JOIN users ON users.id = sessions.user_id
             WHERE sessions.token = ? 
             AND sessions.expires_at > datetime('now')`
          ).bind(token).first<User>()

          if (!session) {
            return jsonResponse({ error: 'Invalid or expired token' }, 401)
          }

          return jsonResponse({ user: session })
        } catch (error) {
          console.error('Token validation error:', error)
          return jsonResponse({ error: 'Validation failed' }, 500)
        }
      }
    }

    return jsonResponse({ error: 'Not found' }, 404)
  }
} 

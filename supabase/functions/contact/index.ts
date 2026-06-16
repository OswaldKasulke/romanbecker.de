import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS })
  }

  try {
    const { name, restaurant, email, message } = await req.json()

    if (!name || !restaurant || !email) {
      return new Response(JSON.stringify({ error: 'Pflichtfelder fehlen' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name,
      restaurant,
      email,
      message: message || '',
    })

    if (dbError) console.error('DB error:', dbError)

    const emailRes = await fetch('https://email-api.mailercloud.com/email', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('MAILERCLOUD_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '1.0',
        email: {
          from: 'noreply@fuerte.digital',
          fromName: 'fuerte.digital',
          subject: `Neue Anfrage: ${restaurant} (${name})`,
          html: `
            <h2>Neue Kontaktanfrage — fuerte.digital</h2>
            <p><strong>Name:</strong> ${esc(name)}</p>
            <p><strong>Restaurant:</strong> ${esc(restaurant)}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
            <p><strong>Nachricht:</strong><br>${esc(message || '—').replace(/\n/g, '<br>')}</p>
          `,
          recipients: {
            to: [{ name: 'Daniel', email: 'daniel@fuerte.digital' }],
          },
        },
        metadata: {
          campaignType: 'TRANSACTIONAL',
          messageId: crypto.randomUUID(),
        },
      }),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error('Mailercloud error:', emailRes.status, errText)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: 'Interner Fehler' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

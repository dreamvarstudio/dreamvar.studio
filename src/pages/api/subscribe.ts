// API Route: POST /api/subscribe
// 1. Guarda correos en Vercel Postgres (Neon).
// 2. Envía correo transaccional de bienvenida vía Brevo SMTP API.
// 3. (Opcional) Agrega el contacto a una lista de Brevo.
//
// Variables de entorno requeridas:
//   DATABASE_URL   – Connection string de Neon Postgres
//   BREVO_API_KEY  – API key de Brevo (para email transaccional y contactos)
// Opcionales:
//   BREVO_LIST_ID  – ID de lista de Brevo para agregar el contacto

import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';

export const prerender = false;

// ── Validación ──────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Paleta (extraída de global.css) ─────────────────────────────────────
const C = {
  nightDeep:   '#080B14',
  night:       '#131B30',
  nightRaise:  '#1B2542',
  line:        '#1E2A47',          // rgba(163,178,214,.16) sobre night-deep ≈ este hex
  text:        '#DDE3EF',
  textSoft:    '#A5B0C9',
  textFaint:   '#7480A0',
  lamp:        '#F2B96C',
  lampBright:  '#FFD08F',
  rem:         '#BE9BF7',
  remGlow:     'rgba(176,132,245,.55)',
} as const;

// ── HTML del correo de bienvenida ───────────────────────────────────────
function buildWelcomeEmail(): string {
  const SITE = 'https://www.dreamvar.studio';
  const LOGO = `${SITE}/img/icon-192.png`;
  const OG   = `${SITE}/img/og.jpg`;

  return /* html */ `
<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Bienvenido a la lista de espera – Duermevela</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: ${C.nightDeep}; }
    /* Dark mode */
    :root { color-scheme: dark; }
    @media (prefers-color-scheme: dark) {
      body, .body-bg { background-color: ${C.nightDeep} !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${C.nightDeep};" class="body-bg">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.nightDeep};">
    <tr><td align="center" style="padding: 40px 16px;">

      <!-- Inner card -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="max-width:580px; width:100%; background-color:${C.night}; border:1px solid ${C.line}; border-radius:16px; overflow:hidden;">

        <!-- Header gradient bar -->
        <tr>
          <td style="height:4px; background: linear-gradient(90deg, ${C.rem}, ${C.lamp});"></td>
        </tr>

        <!-- Logo -->
        <tr>
          <td align="center" style="padding: 36px 32px 20px;">
            <a href="${SITE}" target="_blank" style="text-decoration:none;">
              <img src="${LOGO}" alt="DreamVar Studio" width="64" height="64"
                   style="display:block; width:64px; height:64px; border-radius:12px;" />
            </a>
          </td>
        </tr>

        <!-- Heading -->
        <tr>
          <td align="center" style="padding: 0 32px 8px;">
            <h1 style="margin:0; font-family:'Comic Neue','Segoe Print',cursive,sans-serif; font-weight:400; font-size:28px; line-height:1.15; color:${C.text};">
              ¡Estás en la lista!
            </h1>
          </td>
        </tr>

        <!-- Body text -->
        <tr>
          <td style="padding: 8px 32px 24px;">
            <p style="margin:0 0 16px; font-family:Georgia,'Times New Roman',serif; font-size:17px; line-height:1.65; color:${C.textSoft};">
              Gracias por unirte a la lista de espera de <strong style="color:${C.text};">Duermevela: Rem y el Mar de Sueños</strong>.
            </p>
            <p style="margin:0 0 16px; font-family:Georgia,'Times New Roman',serif; font-size:17px; line-height:1.65; color:${C.textSoft};">
              Te avisaremos en cuanto la demo esté disponible en el <strong style="color:${C.text};">Steam Next Fest</strong>. Mientras tanto, síguenos en redes para ver avances del desarrollo.
            </p>
          </td>
        </tr>

        <!-- OG image -->
        <tr>
          <td style="padding: 0 32px 28px;">
            <a href="${SITE}" target="_blank" style="text-decoration:none;">
              <img src="${OG}" alt="Duermevela: Rem y el Mar de Sueños" width="516"
                   style="display:block; width:100%; max-width:516px; height:auto; border-radius:10px; border:1px solid ${C.line};" />
            </a>
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td align="center" style="padding: 0 32px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="border-radius:999px; background-color:${C.lamp};">
                  <a href="${SITE}" target="_blank"
                     style="display:inline-block; padding:14px 36px; font-family:'Comic Neue','Segoe Print',cursive,sans-serif; font-size:20px; font-weight:700; color:#2A1C0C; text-decoration:none; border-radius:999px;">
                    Visitar DreamVar Studio
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Socials -->
        <tr>
          <td align="center" style="padding: 0 32px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:0 10px;">
                  <a href="https://x.com/dreamvarstudio" target="_blank"
                     style="font-family:Georgia,serif; font-size:14px; color:${C.lamp}; text-decoration:underline;">
                    X (Twitter)
                  </a>
                </td>
                <td style="color:${C.textFaint}; font-size:14px;">·</td>
                <td style="padding:0 10px;">
                  <a href="https://www.instagram.com/dreamvar.studio/" target="_blank"
                     style="font-family:Georgia,serif; font-size:14px; color:${C.lamp}; text-decoration:underline;">
                    Instagram
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding: 0 32px;">
            <div style="height:1px; background-color:${C.line};"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 24px 32px 32px;">
            <p style="margin:0 0 6px; font-family:Georgia,serif; font-size:13px; color:${C.textFaint};">
              © ${new Date().getFullYear()} DreamVar Studio
            </p>
            <p style="margin:0; font-family:Georgia,serif; font-size:13px; color:${C.textFaint};">
              <a href="mailto:hola@dreamvar.studio" style="color:${C.textFaint}; text-decoration:underline;">hola@dreamvar.studio</a>
            </p>
          </td>
        </tr>

      </table>
      <!-- /Inner card -->

    </td></tr>
  </table>
  <!-- /Outer wrapper -->

</body>
</html>`;
}

// ── Endpoint ────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Correo inválido. Revisa que esté bien escrito.' }),
        { status: 400, headers },
      );
    }

    // ── 1. Base de datos ──────────────────────────────────────────────
    const databaseUrl = import.meta.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[subscribe] DATABASE_URL no está configurada');
      return new Response(
        JSON.stringify({ success: false, message: 'Error del servidor. Intenta más tarde.' }),
        { status: 500, headers },
      );
    }

    const sql = neon(databaseUrl);

    // Crear la tabla si no existe (idempotente)
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insertar — RETURNING id para saber si fue nuevo o duplicado
    const rows = await sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    const isNew = rows.length > 0;

    // ── 2. Brevo: email transaccional + contacto ──────────────────────
    const brevoKey = import.meta.env.BREVO_API_KEY;

    if (brevoKey && isNew) {
      const brevoHeaders = {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      // 2a. Correo transaccional de bienvenida
      try {
        const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: brevoHeaders,
          body: JSON.stringify({
            sender: { name: 'DreamVar Studio', email: 'no-reply@dreamvar.studio' },
            to: [{ email }],
            subject: '¡Estás en la lista de espera de Duermevela! 🌙',
            htmlContent: buildWelcomeEmail(),
          }),
        });
        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          console.error('[subscribe] Brevo SMTP error:', emailRes.status, errBody);
        }
      } catch (mailErr) {
        console.error('[subscribe] Error al enviar correo de bienvenida:', mailErr);
      }

      // 2b. Agregar contacto a lista (opcional)
      const brevoListId = import.meta.env.BREVO_LIST_ID;
      if (brevoListId) {
        try {
          await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: brevoHeaders,
            body: JSON.stringify({
              email,
              listIds: [Number(brevoListId)],
              updateEnabled: true,
            }),
          });
        } catch (contactErr) {
          console.error('[subscribe] Error al agregar contacto a Brevo:', contactErr);
        }
      }
    }

    // ── 3. Respuesta ──────────────────────────────────────────────────
    const message = isNew
      ? '¡Listo! Te avisaremos cuando salga la demo. Revisa tu correo 🌙'
      : 'Ya estás en la lista. ¡Te avisaremos!';

    return new Response(
      JSON.stringify({ success: true, message }),
      { status: 200, headers },
    );
  } catch (err: unknown) {
    console.error('[subscribe] Error:', err);

    // Duplicado explícito (safety net)
    if (err instanceof Error && err.message?.includes('unique')) {
      return new Response(
        JSON.stringify({ success: true, message: 'Ya estás en la lista. ¡Te avisaremos!' }),
        { status: 200, headers },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Algo salió mal. Intenta de nuevo.' }),
      { status: 500, headers },
    );
  }
};

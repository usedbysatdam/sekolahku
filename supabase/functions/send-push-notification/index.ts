import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FCM_PROJECT_ID = Deno.env.get('FCM_PROJECT_ID')!;
const FCM_CLIENT_EMAIL = Deno.env.get('FCM_CLIENT_EMAIL')!;
const FCM_PRIVATE_KEY = Deno.env.get('FCM_PRIVATE_KEY')?.replace(/\\n/g, '\n')!;
const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
const ONESIGNAL_API_KEY = Deno.env.get('ONESIGNAL_API_KEY');

async function getFcmAccessToken() {
  const { JWT } = await import('https://deno.land/x/djwt@v2.8/mod.ts');
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new JWT({
    algorithm: 'RS256',
    key: await crypto.subtle.importKey(
      'pkcs8',
      new TextEncoder().encode(FCM_PRIVATE_KEY),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    ),
  }).sign({
    iss: FCM_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  return data.access_token;
}

async function sendViaFcm(token: string, title: string, body: string, data: Record<string, string>) {
  const accessToken = await getFcmAccessToken();
  await fetch(`https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
        android: { priority: 'high', notification: { sound: 'default', channel_id: 'sekolahku' } },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
        webpush: { headers: { Urgency: 'high' }, notification: { icon: '/icons/icon-192.png', requireInteraction: 'true' } },
      },
    }),
  });
}

async function sendViaOneSignal(playerIds: string[], title: string, body: string, data: Record<string, string>) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) return;
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: { Authorization: `Basic ${ONESIGNAL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: { en: title, id: title },
      contents: { en: body, id: body },
      data,
      android_channel_id: 'sekolahku',
      small_icon: 'ic_stat_school',
      large_icon: '/icons/icon-192.png',
    }),
  });
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { user_id, title, message, type = 'info', url = '#/app/notifikasi' } = await req.json();

  if (!user_id || !title || !message) {
    return new Response(JSON.stringify({ error: 'user_id, title, message wajib' }), { status: 400 });
  }

  const { data: notif } = await supabase
    .from('notifications')
    .insert({ user_id, title, message, type })
    .select()
    .single();

  const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_id', user_id);

  let fcmSent = 0, onesignalSent = 0;
  const errors: string[] = [];

  for (const sub of subs || []) {
    try {
      if (sub.provider === 'fcm') {
        await sendViaFcm(sub.token, title, message, { type, url, notification_id: notif?.id || '' });
        fcmSent++;
      }
    } catch (e) {
      errors.push(`FCM ${sub.token.slice(0, 10)}: ${e.message}`);
      if (e.message?.includes('UNREGISTERED') || e.message?.includes('INVALID_ARGUMENT')) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
    }
  }

  const osIds = (subs || []).filter((s) => s.provider === 'onesignal').map((s) => s.token);
  if (osIds.length) {
    try {
      await sendViaOneSignal(osIds, title, message, { type, url, notification_id: notif?.id || '' });
      onesignalSent = osIds.length;
    } catch (e) {
      errors.push(`OneSignal: ${e.message}`);
    }
  }

  return new Response(JSON.stringify({ notification: notif, fcmSent, onesignalSent, errors }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
// Verifies the Cloudflare Turnstile token, then hands the submission to
// Netlify Forms. The browser posts here instead of posting to "/" directly,
// so a submission without a valid token never reaches the form store.
//
// Requires the TURNSTILE_SECRET_KEY environment variable (Netlify:
// Site configuration -> Environment variables). The secret must never
// appear in client-side code.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

exports.handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' };
	}

	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		// Fail closed: without the secret we cannot prove the token is real.
		console.error('TURNSTILE_SECRET_KEY is not set');
		return { statusCode: 500, body: 'Server misconfigured' };
	}

	const params = new URLSearchParams(event.body || '');
	const token = params.get('cf-turnstile-response');

	if (!token) {
		return { statusCode: 400, body: 'Missing captcha token' };
	}

	// Cloudflare wants the visitor IP when we can supply it.
	const ip =
		event.headers['x-nf-client-connection-ip'] ||
		(event.headers['x-forwarded-for'] || '').split(',')[0].trim();

	const verifyBody = new URLSearchParams({ secret, response: token });
	if (ip) verifyBody.set('remoteip', ip);

	let outcome;
	try {
		const res = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: verifyBody.toString(),
		});
		outcome = await res.json();
	} catch (err) {
		console.error('Turnstile verification request failed:', err);
		return { statusCode: 502, body: 'Could not verify captcha' };
	}

	if (!outcome.success) {
		console.warn('Turnstile rejected a submission:', outcome['error-codes']);
		return { statusCode: 400, body: 'Captcha failed' };
	}

	// Verified. Forward the fields to Netlify Forms, dropping the token —
	// it has served its purpose and does not belong in the stored submission.
	params.delete('cf-turnstile-response');

	const siteUrl = process.env.URL || `https://${event.headers.host}`;
	try {
		const res = await fetch(siteUrl + '/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params.toString(),
		});
		if (!res.ok) throw new Error('Netlify Forms responded ' + res.status);
	} catch (err) {
		console.error('Forwarding to Netlify Forms failed:', err);
		return { statusCode: 502, body: 'Could not record submission' };
	}

	return { statusCode: 200, body: 'OK' };
};

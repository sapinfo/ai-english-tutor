import { error } from '@sveltejs/kit';

// Kokoro MLX — Apple Silicon native (port 8881)
const KOKORO_URL = 'http://localhost:8881';

export async function POST({ request }) {
	const { text, voice = 'af_sarah', speed = 1.0 } = await request.json();

	if (!text || !text.trim()) {
		throw error(400, 'Text is required');
	}

	try {
		const response = await fetch(`${KOKORO_URL}/v1/audio/speech`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				input: text,
				voice,
				response_format: 'wav',
				speed
			})
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error('Kokoro TTS error:', errText);
			throw error(500, 'TTS generation failed');
		}

		const audioBuffer = await response.arrayBuffer();

		return new Response(audioBuffer, {
			headers: {
				'Content-Type': 'audio/wav',
				'Content-Length': String(audioBuffer.byteLength)
			}
		});
	} catch (err) {
		console.error('TTS API error:', err);
		throw error(500, `TTS error: ${err.message}`);
	}
}

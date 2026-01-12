const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callGemini = async (prompt, systemInstruction, isJson = false) => {
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: isJson ? { responseMimeType: "application/json" } : {}
    };

    let attempt = 0;
    const maxRetries = 5; // Increased retries
    while (attempt <= maxRetries) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.status === 429) {
                attempt++;
                if (attempt > maxRetries) {
                    console.error("Gemini API: Max retries exceeded (429).");
                    alert("ระบบกำลังทำงานหนัก กรุณารอสักครู่แล้วลองใหม่ครับ (Server Busy)");
                    return null;
                }
                // Exponential backoff with Jitter: 2s, 4s, 8s, 16s, 32s + random 0-1s
                const baseDelay = 2000 * Math.pow(2, attempt - 1);
                const jitter = Math.random() * 1000;
                const delay = baseDelay + jitter;

                console.warn(`Gemini API Rate Limit (429). Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`);
                await wait(delay);
                continue;
            }

            if (!res.ok) {
                const errText = await res.text();
                console.error(`Gemini API Error: ${res.status} ${res.statusText}`, errText);
                return null;
            }

            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (e) {
            console.error("Gemini API Network Error:", e);
            attempt++;
            if (attempt > maxRetries) return null;
            await wait(2000); // Wait bit for network error
        }
    }
    return null;
};

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();
const internalApi = internal as any;

http.route({
    path: "/whatsapp-webhook",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");

        if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log("Webhook verified successfully!");
            return new Response(challenge, { status: 200 });
        }

        console.error("Webhook verification failed: Token mismatch or invalid mode");
        return new Response("Forbidden", { status: 403 });
    }),
});

http.route({
    path: "/whatsapp-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // TODO: Add Signature Validation (X-Hub-Signature-256)

        // Parse the request body
        const body = await request.text();
        let payload;
        try {
            payload = JSON.parse(body);
        } catch (e) {
            return new Response("Invalid JSON", { status: 400 });
        }

        const entry = payload.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
            const message = messages[0];
            console.log("Processing WhatsApp Message:", message.id);

            if (message.type === "image") {
                const imageId = message.image.id;
                const sender = message.from;

                // 1. Get Image URL from Graph API
                const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${imageId}`, {
                    headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }
                });
                const mediaData = await mediaRes.json();

                if (!mediaData.url) {
                    console.error("Failed to get media URL from Meta:", mediaData);
                    return new Response("Media error", { status: 500 });
                }

                // 2. Download Image Binary
                const imageRes = await fetch(mediaData.url, {
                    headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }
                });
                const imageBlob = await imageRes.blob();

                // 3. Store in Convex
                const storageId = await ctx.storage.store(imageBlob);

                // 3.5 Compute SHA-256 Hash for Duplicate Detection
                const imageBuffer = await imageBlob.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest("SHA-256", imageBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                // 4. Create Payment Record
                const paymentId = await ctx.runMutation(internalApi.payments.create, {
                    whatsappMetadata: {
                        messageId: message.id,
                        senderPhone: sender,
                        timestamp: parseInt(message.timestamp) * 1000
                    },
                    popStorageId: storageId,
                    imageHash: hashHex
                });

                // 5. Trigger AI Processing & Forensics
                await ctx.runAction(internalApi.ai_agent.processPop, { storageId, paymentId });
                // Parallelize where possible or keep sequential for safety? 
                // Let's do parallel
                await Promise.all([
                    ctx.runAction(internalApi.fraud_actions.analyzeImageForensics, { popStorageId: storageId, paymentId }),
                    ctx.runAction(internalApi.fraud_actions.performOCR, { popStorageId: storageId, paymentId })
                ]);

                console.log(`Successfully processed image ${imageId} for payment ${paymentId}`);
            }
        }

        // Acknowledge receipt immediately to avoid Meta retries
        return new Response("EVENT_RECEIVED", { status: 200 });
    }),
});

export default http;

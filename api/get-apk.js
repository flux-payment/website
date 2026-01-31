export default function handler(req, res) {
    // 1. Your Direct Download Link (using env var)
    const SECURE_FILE_ID = process.env.APK_DRIVE_ID;
    const DIRECT_LINK = `https://drive.google.com/uc?export=download&id=${SECURE_FILE_ID}`;

    // 2. Security: Check if the request is coming from YOUR website
    const referer = req.headers.referer || "";
    const host = req.headers.host || "";

    // If the request didn't come from your site (e.g. someone pasted the link in WhatsApp), block them.
    // Note: On localhost, referer might be http://localhost:5173 and host localhost:3000 (if run via `vercel dev`)
    // Basically, we trust if referer contains our host (or localhost for dev).

    // Also checking cookie as requested for double security
    const cookies = req.headers.cookie || "";
    if (!cookies.includes("flux_access=granted")) {
        return res.redirect(307, "/");
    }

    if (!referer.includes(host) && !host.includes("localhost")) {
        return res.redirect(307, "/"); // Redirect thieves to the home page
    }

    // 3. Success -> Redirect the valid user to the download
    return res.redirect(307, DIRECT_LINK);
}

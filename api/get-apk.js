export default function handler(req, res) {
    // 1. Your GitHub Direct Download Link (using env var)
    const DOWNLOAD_URL = process.env.APK_DOWNLOAD_URL || "https://github.com/flux-payment/website/releases/download/v1.0-beta/app-release.apk";

    // 2. The "Bouncer" Logic - Check if the request is coming from YOUR website
    const referer = req.headers.referer || "";
    const host = req.headers.host || "";

    // Block Direct Access (e.g., from WhatsApp or Browser URL bar)
    // This ensures people have to go through your /early-access page
    const cookies = req.headers.cookie || "";
    if (!cookies.includes("flux_access=granted")) {
        return res.redirect(307, "/");
    }

    if (!referer.includes(host) && !host.includes("localhost")) {
        return res.redirect(307, "/"); // Redirect thieves to the home page
    }

    // 3. Set headers to prevent caching of the redirect
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    // 4. Success -> Redirect to GitHub
    return res.redirect(307, DOWNLOAD_URL);
}

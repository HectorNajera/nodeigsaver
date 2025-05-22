const express = require('express');
const cors = require('cors');
const { instagramGetUrl } = require('instagram-url-direct'); // ✅ fixed here
const serverless = require('serverless-http');

const app = express();
// ✅ Setup CORS
app.use(cors({
    origin: 'https://igsaver-hoz.web.app',
    methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.options('*', cors());  // ✅ Handle preflight
app.use(express.json());

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from Vercel!' });
});
app.post('/fetch-instagram', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const result = await instagramGetUrl(url);
        const mediaUrl = result.url_list[0];
        const isImage = mediaUrl.includes('.jpg') || mediaUrl.includes('.png');

        res.json({
            mediaUrl,
            type: isImage ? 'image' : 'video'
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

module.exports = app;
// module.exports.handler = serverless(app);
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

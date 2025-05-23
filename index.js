const express = require('express');
const cors = require('cors');
const { instagramGetUrl } = require('instagram-url-direct');
const serverless = require('serverless-http');

const app = express();

app.use(cors({
    origin: ['https://igsaver-hoz.web.app', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.options('*', cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express on Vercel!!!' });
});

app.post('/api/fetch-instagram', async (req, res) => {
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
//new
module.exports = app;
module.exports.handler = serverless(app);

// // For local development
// if (require.main === module) {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running locally on http://localhost:${PORT}`);
//     });
// }
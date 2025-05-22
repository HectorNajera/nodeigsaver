const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { instagramGetUrl } = require('instagram-url-direct'); // ✅ fixed here
const serverless = require("serverless-http");

// const app = express();
// const PORT = 3000;
//
// app.use(cors());
// app.use(bodyParser.json());
const app = express();
app.use(cors({
    origin: '*',  // Or: ['http://localhost:4200', 'https://your-frontend.vercel.app']
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.options('*', cors()); // Pre-flight OPTIONS request

app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express on Vercel!" });
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

module.exports.handler = serverless(app);
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

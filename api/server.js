const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { instagramGetUrl } = require('instagram-url-direct'); // ✅ fixed here

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/instagram', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

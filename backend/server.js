const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware for handling file uploads in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.post('/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }

    try {
        const response = await axios.post('https://api-inference.huggingface.co/models/facebook/detr-resnet-50', {
            inputs: req.file.buffer.toString('base64'), // Convert image buffer to base64
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Replace with your API key
                'Content-Type': 'application/json'
            }
        });

        // Process the response to get detected labels and their confidence scores
        const results = response.data;

        // Format the results
        const formattedResults = results.map(item => ({
            label: item.label,
            score: item.score
        }));

        // Log and return the response data
        console.log('Hugging Face Response:', formattedResults);
        res.json(formattedResults);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to analyze the image', details: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

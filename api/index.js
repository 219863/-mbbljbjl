const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

/**
 * Create a new review
 * @param {string} movieID - The ID of the movie
 * @param {string} content - The content of the review
 */
app.post('/reviews', async (req, res) => {
    try {
        const { movieID, content } = req.body;
        const review = await prisma.review.create({ data: { movieID, content } });
        res.json(review);
    } catch (error) {
        console.error("Failed to create review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Get reviews.
 * @param {string} movieID - The ID of the movie.
 */
app.get('/reviews/:movieID', async (req, res) => {
    const { movieID } = req.params;
    const reviews = await prisma.review.findMany({ where: { movieID } });
    res.json(reviews);
});

/**
 * Update a review.
 * @param {string} id - The ID of the review
 * @param {string} content - The new content of the review
 */
app.put('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: { content }
        });
        res.json(review);
    } catch (error) {
        console.error("Failed to update review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Delete the review by ID.
 * @param {string} id - The ID of the review
 */
app.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.review.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
    } catch (error) {
        console.error("Failed to delete review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Run the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




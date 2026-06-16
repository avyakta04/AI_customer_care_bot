require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// The Python ML Service runs on port 8000
const PYTHON_ML_URL = 'http://127.0.0.1:8000';

app.use(express.json());
app.use(cors());

// ==========================================
// 1. Health Checks
// ==========================================
app.get('/', (req, res) => {
    res.json({ message: "Node.js API Gateway Running" });
});

app.get('/health', async (req, res) => {
    try {
        // Also check if Python service is healthy
        const pythonHealth = await axios.get(`${PYTHON_ML_URL}/health`);
        res.json({
            status: "healthy",
            node_version: process.version,
            ml_service_status: pythonHealth.data
        });
    } catch (error) {
        res.status(500).json({ status: "degraded", ml_service_status: "offline" });
    }
});

// ==========================================
// 2. AI & ML Proxy Endpoints
// ==========================================
app.post('/api/predict', async (req, res) => {
    try {
        const { text } = req.body;
        
        // 1. Ask Python for the ML Prediction
        const pythonResponse = await axios.post(`${PYTHON_ML_URL}/api/predict`, req.body);
        const prediction = pythonResponse.data;

        // 2. Save the interaction in PostgreSQL (Fail-safe)
        try {
            await prisma.chatLog.create({
                data: {
                    userText: text,
                    aiIntent: prediction.intent || "unknown",
                    aiEmotion: prediction.emotion || "unknown"
                }
            });
        } catch (dbError) {
            console.warn("DB Warning: Could not save chat log:", dbError.message);
        }

        // 3. Return prediction to frontend
        res.json(prediction);
    } catch (error) {
        console.error("ML Prediction Error:", error.message);
        res.status(500).json({ error: "Failed to get AI prediction" });
    }
});

app.post('/api/voice/analyze', async (req, res) => {
    try {
        // Proxy raw voice/audio data to Python
        const pythonResponse = await axios.post(`${PYTHON_ML_URL}/api/voice/analyze`, req.body);
        res.json(pythonResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze voice" });
    }
});

app.post('/api/memory/search', async (req, res) => {
    try {
        const pythonResponse = await axios.post(`${PYTHON_ML_URL}/api/memory/search`, req.body);
        res.json(pythonResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Memory search failed" });
    }
});

app.post('/api/hindsight/train', async (req, res) => {
    try {
        const pythonResponse = await axios.post(`${PYTHON_ML_URL}/api/hindsight/train`, req.body);
        res.json(pythonResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Training trigger failed" });
    }
});

// ==========================================
// 3. PostgreSQL Database Endpoints
// ==========================================
app.post('/api/hindsight/feedback', async (req, res) => {
    try {
        const { rating, comments } = req.body;
        const feedback = await prisma.feedback.create({
            data: { rating, comments }
        });
        res.json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({ error: "Failed to save feedback" });
    }
});

app.get('/api/hindsight/logs', async (req, res) => {
    try {
        // Fetch logs directly from Postgres
        const logs = await prisma.chatLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.get('/api/metrics', async (req, res) => {
    try {
        // Example: Combine DB metrics with Python metrics
        const chatCount = await prisma.chatLog.count();
        const pythonMetrics = await axios.get(`${PYTHON_ML_URL}/api/metrics`).catch(() => ({ data: "ML metrics unavailable" }));
        
        res.json({
            totalInteractionsSaved: chatCount,
            ml_metrics: pythonMetrics.data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js Gateway is running on http://localhost:${PORT}`);
    console.log(`Proxying AI requests to Python ML Service at ${PYTHON_ML_URL}`);
});

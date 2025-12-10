const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static('.')); // 提供静态文件（HTML）

// CORS 支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Mock API 数据
const mockImages = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    'https://images.unsplash.com/photo-1573865526739-10c1dd9c5f49?w=800',
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800'
];

const mockVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
];

const mockAudios = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
];

// API 路由 - 图像生成
app.post('/api/generate-image', async (req, res) => {
    const { skillId, prompt } = req.body;

    console.log(`[图像生成] Skill: ${skillId}, Prompt: ${prompt}`);

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 返回随机 Mock 图片
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

    res.json({
        imageUrl: randomImage,
        skillId: skillId,
        prompt: prompt,
        status: 'success',
        isMock: true
    });
});

// API 路由 - 视频生成
app.post('/api/generate-video', async (req, res) => {
    const { skillId, prompt } = req.body;

    console.log(`[视频生成] Skill: ${skillId}, Prompt: ${prompt}`);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const randomVideo = mockVideos[Math.floor(Math.random() * mockVideos.length)];

    res.json({
        videoUrl: randomVideo,
        skillId: skillId,
        prompt: prompt,
        status: 'success',
        isMock: true
    });
});

// API 路由 - 音频生成
app.post('/api/generate-audio', async (req, res) => {
    const { skillId, prompt } = req.body;

    console.log(`[音频生成] Skill: ${skillId}, Prompt: ${prompt}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomAudio = mockAudios[Math.floor(Math.random() * mockAudios.length)];

    res.json({
        audioUrl: randomAudio,
        skillId: skillId,
        prompt: prompt,
        status: 'success',
        isMock: true
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', mode: 'mock' });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🌊 SeaVerse AI 搜索原型服务器已启动！

📍 访问地址: http://localhost:${PORT}
🔧 模式: Mock API（测试数据）
📝 日志: 所有 API 调用会在此显示

提示: 如需使用真实 API，请参考 README.md
    `);
});

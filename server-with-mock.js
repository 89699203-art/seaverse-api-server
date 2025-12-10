const express = require('express');
const cors = require('cors');
const { getMockResult } = require('./mock-api');
const app = express();

// 配置
const PORT = process.env.PORT || 3000;
const USE_MOCK = process.env.USE_MOCK !== 'false'; // 默认使用 Mock

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'SeaVerse AI Search API Server',
        version: '1.0.0',
        mode: USE_MOCK ? 'mock' : 'production'
    });
});

// 图像生成接口
app.post('/api/generate-image', async (req, res) => {
    try {
        const { skillId, prompt } = req.body;

        if (!skillId || !prompt) {
            return res.status(400).json({ error: '缺少 skillId 或 prompt 参数' });
        }

        console.log(`[图像生成] Skill: ${skillId}, Prompt: ${prompt}`);

        if (USE_MOCK) {
            // 使用 Mock 数据
            const result = await getMockResult(skillId, prompt);
            res.json(result);
        } else {
            // 真实调用（需要配置 Skills 目录）
            const result = await callImageSkill(skillId, prompt);
            res.json(result);
        }
    } catch (error) {
        console.error('[图像生成错误]', error);
        res.status(500).json({ error: error.message });
    }
});

// 视频生成接口
app.post('/api/generate-video', async (req, res) => {
    try {
        const { skillId, prompt } = req.body;

        if (!skillId || !prompt) {
            return res.status(400).json({ error: '缺少 skillId 或 prompt 参数' });
        }

        console.log(`[视频生成] Skill: ${skillId}, Prompt: ${prompt}`);

        if (USE_MOCK) {
            const result = await getMockResult(skillId, prompt);
            res.json(result);
        } else {
            const result = await callVideoSkill(skillId, prompt);
            res.json(result);
        }
    } catch (error) {
        console.error('[视频生成错误]', error);
        res.status(500).json({ error: error.message });
    }
});

// 音频生成接口
app.post('/api/generate-audio', async (req, res) => {
    try {
        const { skillId, prompt } = req.body;

        if (!skillId || !prompt) {
            return res.status(400).json({ error: '缺少 skillId 或 prompt 参数' });
        }

        console.log(`[音频生成] Skill: ${skillId}, Prompt: ${prompt}`);

        if (USE_MOCK) {
            const result = await getMockResult(skillId, prompt);
            res.json(result);
        } else {
            const result = await callAudioSkill(skillId, prompt);
            res.json(result);
        }
    } catch (error) {
        console.error('[音频生成错误]', error);
        res.status(500).json({ error: error.message });
    }
});

// 真实调用函数（仅当 USE_MOCK=false 时使用）
async function callImageSkill(skillId, prompt) {
    const { exec } = require('child_process');
    const params = JSON.stringify([{
        prompt: prompt,
        ...(skillId === 'api_volces_seedream_4_5' && {
            width: 1024,
            height: 1024
        })
    }]);

    const command = `cd /home/sandbox/.seaverse/skills/${skillId} && python3 scripts/*_tool.py '${params.replace(/'/g, "'\\''")}'`;

    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error('[Exec Error]', stderr);
                reject(new Error(stderr || error.message));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                console.log('[API 返回]', result);

                if (result.status === 'finished' && result.data && result.data[0]) {
                    const imageUrl = result.data[0].url ||
                                   result.data[0].image_url ||
                                   result.data[0].output_image_url;

                    if (imageUrl) {
                        resolve({ imageUrl: imageUrl });
                    } else {
                        reject(new Error('未找到图片 URL'));
                    }
                } else {
                    reject(new Error('生成失败或返回数据异常'));
                }
            } catch (e) {
                console.error('[解析错误]', e, stdout);
                reject(new Error('解析结果失败: ' + e.message));
            }
        });
    });
}

async function callVideoSkill(skillId, prompt) {
    const { exec } = require('child_process');
    const params = JSON.stringify([{
        prompt: prompt,
        mode: 'pro',
        duration: '5',
        ...(skillId === 'api_kling_v2_6' && {
            sound: 'on'
        })
    }]);

    const command = `cd /home/sandbox/.seaverse/skills/${skillId} && python3 scripts/*_tool.py '${params.replace(/'/g, "'\\''")}'`;

    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 10 * 1024 * 1024, timeout: 120000 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                if (result.status === 'finished' && result.data && result.data[0]) {
                    const videoUrl = result.data[0].url || result.data[0].video_url;
                    if (videoUrl) {
                        resolve({ videoUrl: videoUrl });
                    } else {
                        reject(new Error('未找到视频 URL'));
                    }
                } else {
                    reject(new Error('生成失败或返回数据异常'));
                }
            } catch (e) {
                reject(new Error('解析结果失败: ' + e.message));
            }
        });
    });
}

async function callAudioSkill(skillId, prompt) {
    const { exec } = require('child_process');
    const params = JSON.stringify([{ prompt: prompt }]);
    const command = `cd /home/sandbox/.seaverse/skills/${skillId} && python3 scripts/*_tool.py '${params.replace(/'/g, "'\\''")}'`;

    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 10 * 1024 * 1024, timeout: 120000 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                if (result.status === 'finished' && result.data && result.data[0]) {
                    const audioUrl = result.data[0].url || result.data[0].audio_url;
                    if (audioUrl) {
                        resolve({ audioUrl: audioUrl });
                    } else {
                        reject(new Error('未找到音频 URL'));
                    }
                } else {
                    reject(new Error('生成失败或返回数据异常'));
                }
            } catch (e) {
                reject(new Error('解析结果失败: ' + e.message));
            }
        });
    });
}

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 SeaVerse API Server running on port ${PORT}`);
    console.log(`   Mode: ${USE_MOCK ? '🎭 Mock (演示模式)' : '⚡ Production (真实调用)'}`);
    console.log(`   Health check: http://localhost:${PORT}/`);
    console.log(`   Image API: http://localhost:${PORT}/api/generate-image`);
    console.log(`   Video API: http://localhost:${PORT}/api/generate-video`);
    console.log(`   Audio API: http://localhost:${PORT}/api/generate-audio`);

    if (USE_MOCK) {
        console.log(`\n   💡 提示: 当前使用 Mock 数据，设置环境变量 USE_MOCK=false 启用真实调用`);
    }
});
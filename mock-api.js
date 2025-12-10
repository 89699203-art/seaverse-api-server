/**
 * Mock API - 用于 Replit 部署时快速演示
 * 无需真实调用 Skills，返回模拟数据
 */

const mockResults = {
    // 图像生成 Skills
    'api_volces_seedream_4_5': {
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024&h=1024&fit=crop'
    },
    'api_jimeng_4_0': {
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1024&h=1024&fit=crop'
    },
    'api_midjourney_v6': {
        imageUrl: 'https://images.unsplash.com/photo-1573865526739-10c1dd7c4f1e?w=1024&h=1024&fit=crop'
    },

    // 视频生成 Skills
    'api_kling_v2_6': {
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
    },
    'api_alibaba_wanx25_t2v_preview': {
        videoUrl: 'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4'
    },

    // 音频生成 Skills
    'api_mureka_song_generator': {
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    'api_mureka_instrumental_generator': {
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }
};

/**
 * 获取 Mock 结果
 * @param {string} skillId - Skill ID
 * @param {string} prompt - 用户提示词
 * @returns {Promise<object>} Mock 结果
 */
function getMockResult(skillId, prompt) {
    return new Promise((resolve, reject) => {
        // 模拟真实 API 的延迟（2-3 秒）
        const delay = 2000 + Math.random() * 1000;

        setTimeout(() => {
            const result = mockResults[skillId];

            if (result) {
                console.log(`[Mock] 成功返回 ${skillId} 的模拟结果`);
                console.log(`[Mock] 原始 Prompt: ${prompt}`);
                resolve(result);
            } else {
                console.error(`[Mock] 未找到 ${skillId} 的模拟数据`);
                reject(new Error(`Unknown skill: ${skillId}`));
            }
        }, delay);
    });
}

module.exports = { getMockResult };
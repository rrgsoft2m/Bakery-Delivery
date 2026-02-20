const crypto = require('crypto');
const User = require('../models/User');

/**
 * Validates Telegram WebApp initData hash
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
const validateTelegramData = (initData) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return false;

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Sort alphabetically
    const dataCheckArr = [];
    params.sort();
    params.forEach((value, key) => {
        dataCheckArr.push(`${key}=${value}`);
    });
    const dataCheckString = dataCheckArr.join('\n');

    // HMAC-SHA256 signature
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return computedHash === hash;
};

const telegramAuth = async (req, res, next) => {
    try {
        const { initData } = req.body;

        // In development, skip validation if no token is set
        if (process.env.NODE_ENV === 'development' && !process.env.TELEGRAM_BOT_TOKEN) {
            req.telegramUser = req.body.user || { id: 'dev-user', first_name: 'Dev' };
            next();
            return;
        }

        if (!initData) {
            return res.status(401).json({ error: 'No Telegram initData provided' });
        }

        if (!validateTelegramData(initData)) {
            return res.status(401).json({ error: 'Invalid Telegram data' });
        }

        // Extract user from initData
        const params = new URLSearchParams(initData);
        const userData = JSON.parse(params.get('user') || '{}');
        req.telegramUser = userData;

        // Find or create user
        let user = await User.findOne({ telegramId: String(userData.id) });
        if (!user) {
            user = await User.create({
                telegramId: String(userData.id),
                firstName: userData.first_name || 'User',
                lastName: userData.last_name || '',
                language: userData.language_code === 'ru' ? 'ru' : 'uz',
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Telegram auth error:', error);
        res.status(401).json({ error: 'Telegram authentication failed' });
    }
};

module.exports = { telegramAuth, validateTelegramData };

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-frontend.vercel.app';
const API_URL = process.env.API_URL || 'http://localhost:4000';

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is not set in .env file');
    console.log('ℹ️  Create a bot at @BotFather and set the token in bot/.env');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// /start command — Opens Mini App
bot.start(async (ctx) => {
    const user = ctx.from;
    const lang = user.language_code === 'ru' ? 'ru' : user.language_code === 'en' ? 'en' : 'uz';

    const messages = {
        uz: `🍰 Salom, ${user.first_name}!\n\nShirinliklar yetkazib berish xizmatiga xush kelibsiz!\n\nQuyidagi tugmani bosib, shirinliklarimizni ko'ring va buyurtma bering:`,
        ru: `🍰 Привет, ${user.first_name}!\n\nДобро пожаловать в сервис доставки выпечки!\n\nНажмите кнопку ниже, чтобы просмотреть нашу выпечку и оформить заказ:`,
        en: `🍰 Hello, ${user.first_name}!\n\nWelcome to our Bakery Delivery service!\n\nPress the button below to browse our pastries and place an order:`,
    };

    const btnLabels = { uz: '🛒 Buyurtma berish', ru: '🛒 Заказать', en: '🛒 Order Now' };

    // Set persistent Menu button
    try {
        await ctx.setChatMenuButton({
            text: (btnLabels[lang] || btnLabels.uz),
            type: "web_app",
            web_app: { url: WEBAPP_URL }
        });
    } catch (e) {
        console.log('Error setting menu button:', e.message);
    }

    await ctx.reply(messages[lang] || messages.uz, {
        reply_markup: {
            inline_keyboard: [
                [{ text: btnLabels[lang] || btnLabels.uz, web_app: { url: WEBAPP_URL } }],
            ],
        },
    });

    // Register user via API
    try {
        const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch if Node 18+
        await fetch(`${API_URL}/api/auth/telegram/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: { id: user.id, first_name: user.first_name, last_name: user.last_name || '', language_code: user.language_code },
            }),
        });
    } catch (err) {
        console.log('Could not register user:', err.message);
    }
});

// /menu command
bot.command('menu', async (ctx) => {
    const lang = ctx.from.language_code === 'ru' ? 'ru' : ctx.from.language_code === 'en' ? 'en' : 'uz';
    const msgs = {
        uz: '🍰 Bizning menyuni ko\'rish uchun tugmani bosing:',
        ru: '🍰 Нажмите кнопку, чтобы просмотреть наше меню:',
        en: '🍰 Press the button to view our menu:',
    };
    await ctx.reply(msgs[lang], {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 Menu', web_app: { url: WEBAPP_URL } }],
            ],
        },
    });
});

// /orders command
bot.command('orders', async (ctx) => {
    const lang = ctx.from.language_code === 'ru' ? 'ru' : ctx.from.language_code === 'en' ? 'en' : 'uz';
    try {
        const fetch = require('node-fetch');
        const res = await fetch(`${API_URL}/api/orders/user/${ctx.from.id}`);
        const orders = await res.json();

        if (!orders || orders.length === 0) {
            const noOrders = { uz: '📦 Sizda hali buyurtmalar yo\'q.', ru: '📦 У вас пока нет заказов.', en: '📦 You have no orders yet.' };
            return ctx.reply(noOrders[lang]);
        }

        let msg = lang === 'ru' ? '📦 Ваши заказы:\n\n' : lang === 'en' ? '📦 Your orders:\n\n' : '📦 Sizning buyurtmalaringiz:\n\n';
        orders.slice(0, 5).forEach((o, i) => {
            const status = { pending: '⏳', paid: '💳', preparing: '👨‍🍳', delivering: '🚚', delivered: '✅', cancelled: '❌' };
            msg += `${i + 1}. ${status[o.status] || '❓'} #${o._id.slice(-6)} — ${new Intl.NumberFormat().format(o.totalPrice)} sum\n`;
        });
        await ctx.reply(msg);
    } catch {
        await ctx.reply(lang === 'ru' ? '❌ Ошибка загрузки' : lang === 'en' ? '❌ Failed to load orders' : '❌ Buyurtmalarni yuklashda xatolik');
    }
});

// Handle WebApp data
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data);
        const lang = ctx.from.language_code === 'ru' ? 'ru' : ctx.from.language_code === 'en' ? 'en' : 'uz';
        const msgs = {
            uz: `✅ Buyurtmangiz qabul qilindi!\n\n🆔 Buyurtma: #${data.orderId?.slice?.(-6) || 'N/A'}\n💰 Jami: ${new Intl.NumberFormat().format(data.total)} sum\n\nTez orada yetkazib beramiz! 🍰`,
            ru: `✅ Ваш заказ принят!\n\n🆔 Заказ: #${data.orderId?.slice?.(-6) || 'N/A'}\n💰 Итого: ${new Intl.NumberFormat().format(data.total)} сум\n\nСкоро доставим! 🍰`,
            en: `✅ Your order is confirmed!\n\n🆔 Order: #${data.orderId?.slice?.(-6) || 'N/A'}\n💰 Total: ${new Intl.NumberFormat().format(data.total)} sum\n\nWe'll deliver it soon! 🍰`,
        };
        await ctx.reply(msgs[lang]);
    } catch {
        await ctx.reply('✅ Order received!');
    }
});

// /help
bot.help(async (ctx) => {
    await ctx.reply(
        '🍰 Bakery Delivery Bot\n\n' +
        '/start — Open mini app\n' +
        '/menu — View catalog\n' +
        '/orders — Your order history\n' +
        '/help — Show this message'
    );
});

// Launch
bot.launch().then(() => {
    console.log('🤖 Bakery Bot is running!');
}).catch(err => {
    console.error('Bot launch error:', err.message);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');


const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://bakery-delivery-p8vy.vercel.app';
const API_URL = process.env.API_URL || 'https://bakery-delivery-backendbakery-delivery.onrender.com';


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

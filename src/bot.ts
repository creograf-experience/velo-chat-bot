import Telegraf, { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import mongoose from 'mongoose';
import logger from './util/logger';
import asyncWrapper from './util/error-handler';
import profileScene from './controllers/profile/index';
import changeCity from './controllers/profile/changeCity';
import changeAge from './controllers/profile/changeAge';
import changeGender from './controllers/profile/changeGender';
import changeSport from './controllers/profile/changeSport';
import startScene from './controllers/start';
import training from './controllers/training';
import trainingCity from './controllers/training/trainingCity';
import { updateUserTimestamp } from './middlewares/update-user-timestamp';
import trainingStartPoint from './controllers/training/trainingStartPoint';
import trainingStartTime from './controllers/training/trainingStartTime';
import trainingSport from './controllers/training/trainingSport';
import trainingType from './controllers/training/trainingType';
import trainingDistantion from './controllers/training/trainingDistantion';
import trainingTime from './controllers/training/trainingTime';
import trainingDescription from './controllers/training/trainingDescription';
import allTraining from './controllers/training/allTraining';
import deleteTraining from './controllers/training/deleteTraining';
import subscribe from './controllers/subscribe';
import subscribeCity from './controllers/subscribe/subscribeCity';
import subscribeType from './controllers/subscribe/subscribeType';
import deleteSubscribe from './controllers/subscribe/deleteSubscribe';
import subscribeInfo from './controllers/subscribe/subscribeInfo';
import searchCity from './controllers/search/searchCity';
import searchSport from './controllers/search/searchSport';
import search from './controllers/search';
import searchType from './controllers/search/searchType';
import searchResult from './controllers/search/searchResult';
import searchCalendarBegin from './controllers/search/searchCalendarBegin';
import searchCalendarEnd from './controllers/search/searchCalendarEnd';
import allSubscribeInfo from './controllers/subscribe/allSubscribeInfo';
import allSearchInfo from './controllers/search/allSearchInfo';
import trainingDateBegin from './controllers/training/trainingDateBegin';



mongoose.connect(`mongodb://localhost/velo-chat-bot`,{
    useNewUrlParser: true,
    useFindAndModify: false
});
mongoose.connection.on('error', err => {
    logger.error(
      undefined,
      `Error occurred during an attempt to establish connection with the database: %O`,
      err
    );
    process.exit(1);
});
mongoose.connection.on('open', () => {
    const bot = new Telegraf('1080233744:AAECGgyW2IPtH2k_ijTjVkoafHqpzeqp8pU');
    const stage = new Stage([
        startScene,
        profileScene,
        changeCity,
        changeAge,
        changeGender,
        changeSport,
        training,
        allTraining,
        trainingCity,
        trainingSport,
        trainingStartPoint,
        trainingDateBegin,
        trainingStartTime,
        trainingType,
        trainingDistantion,
        trainingTime,
        trainingDescription,
        deleteTraining,
        subscribe,
        subscribeCity,
        subscribeType,
        deleteSubscribe,
        subscribeInfo,
        allSubscribeInfo,
        searchCity,
        searchSport,
        search,
        searchType,
        searchResult,
        searchCalendarBegin,
        searchCalendarEnd,
        allSearchInfo
    ]);

    bot.use(session());
    bot.use(stage.middleware());
    bot.start(asyncWrapper(async(ctx: ContextMessageUpdate) => ctx.scene.enter('start')));
    bot.hears(
        '👨 Мои данные',
        updateUserTimestamp,
        asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('profile'))
    );
    bot.hears(
        '💪 Мои тренировки',
        updateUserTimestamp,
        asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('training'))
    );
    bot.hears(
        '📃 Мои подписки',
        updateUserTimestamp,
        asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('subscribe'))
    );
    bot.hears(
        '🔎 Поиск',
        updateUserTimestamp,
        asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('searchCity'))
    );
    bot.launch();
});

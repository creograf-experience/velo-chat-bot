import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findById(uid);
  const { mainKeyboard } = getMainKeyboard(ctx);

  if (user) {
    await ctx.reply('👋 С возвращением! Чем я могу помочь тебе?', mainKeyboard);
  } else {
    logger.debug(ctx, 'New user has been created');
    const now = new Date().getTime();

    const newUser = new User({
      _id: uid,
      created: now,
      username: ctx.from.username,
      firstname: ctx.from.first_name,
      lastname: ctx.from.last_name,
      telegramId: ctx.from.id,
      lastActivity: now,
      myTraining:[],
      mySubscribe:[],
      gender: '',
      age: '',
      city: '',
      sport: ''
    });

    await newUser.save();
    await ctx.reply('👋 Добро пожаловать. Чем я могу вам помочь?', mainKeyboard);
  }
});

start.leave(async (ctx: ContextMessageUpdate) => {
  
});

start.command('saveme', leave());


export default start;

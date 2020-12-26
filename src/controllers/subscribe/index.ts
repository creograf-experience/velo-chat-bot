import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { getMainKeyboard, getSubscribeKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Subscribe from '../../models/Subscribe';
import { url } from 'inspector';



const { leave } = Stage;
const subscribe = new Scene('subscribe');


subscribe.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters subscribe scene');
  const subscribe = await Subscribe.find({'userId':ctx.from.id});
  const { subscribeKeyboard } = getSubscribeKeyboard(ctx);
  deleteFromSession(ctx, 'subscribeScene');
  if(subscribe.length){
    const keyboard = [];
    for (let item of subscribe){
      if(item.typeSport.length) keyboard.push([{text: `${item.city}, ${item.typeSport}`, callback_data:item._id}])
      else keyboard.push([{text: `${item.city}`, callback_data:item._id}])
    }
    await ctx.reply('📃 Ваши подписки:',{
      reply_markup : {
        inline_keyboard: keyboard,
      }
    });
    await ctx.reply('Для просмотра доступных тренировок по подписке нажмите на подписку',subscribeKeyboard)
  } else {
    await ctx.reply('На данный момент вы не подписанны на тренировки',subscribeKeyboard)
  }
  
});

subscribe.command('saveme', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves subscribe scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'subscribeScene');
});

subscribe.hears('◀️ Назад', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves subscribe scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'subscribeScene');
});

subscribe.hears('✅ Подписаться на тренировки', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('subscribeCity'))
);

subscribe.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.session.idSubscribe=ctx.callbackQuery.data;
  ctx.scene.enter('subscribeInfo');
});

subscribe.hears('❎ Отписаться от подписок', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('deleteSubscribe'))
);

export default subscribe;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import city from '../../city.json'


const { leave } = Stage;
const subscribeCity = new Scene('subscribeCity');


subscribeCity.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  var keyboard = [];
  for (let el of city){
    keyboard.push([{text:el.name, callback_data:el.name}])
  }
  await ctx.reply('✅ Отлично, вы решили подписаться на тренировки',backKeyboard);
  await ctx.reply('🏢 Выберите город из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

subscribeCity.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.deleteMessage();
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    ctx.session.subscribeCity=ctx.callbackQuery.data
    await ctx.scene.enter('subscribeType')
});

subscribeCity.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('subscribe'))
);

export default subscribeCity;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import city from '../../city.json'


const { leave } = Stage;
const trainingCity = new Scene('trainingCity');


trainingCity.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  var keyboard = [];
  for (let el of city){
    keyboard.push([{text:el.name, callback_data:el.name}])
  }
  await ctx.reply('💪 Отлично, вы решили создать тренировку',backKeyboard);
  await ctx.reply('🏢 Выберите город из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

trainingCity.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.deleteMessage();
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    ctx.session.city=ctx.callbackQuery.data
    await ctx.scene.enter('trainingSport')
});

trainingCity.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('training'))
);

export default trainingCity;
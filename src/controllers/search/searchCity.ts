import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard, getMainKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import city from '../../city.json'


const { leave } = Stage;
const searchCity = new Scene('searchCity');


searchCity.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  var keyboard = [];
  for (let el of city){
    keyboard.push([{text:el.name, callback_data:el.name}])
  }
  await ctx.reply('Отлично, вы решили начать поиск',backKeyboard);
  await ctx.reply('🏢 Выберите город из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

searchCity.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.deleteMessage();
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    ctx.session.searchCity=ctx.callbackQuery.data
    await ctx.scene.enter('searchSport')
});

searchCity.hears('◀️ Назад', async (ctx: ContextMessageUpdate) => {
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply('Главное меню',mainKeyboard);
  }
);

export default searchCity;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard, getProfileKeyboard, getBackKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import city from '../../city.json'


const { leave } = Stage;
const changeCity = new Scene('changeCity');


changeCity.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  var keyboard = [];
  for (let el of city){
    keyboard.push([{text:el.name, callback_data:el.name}])
  }
  await ctx.reply('✏️ Отлично, вы решили изменить данные',backKeyboard);
  await ctx.reply('🏢 Выберите город из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

changeCity.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.deleteMessage();
    await User.findOneAndUpdate(
      {_id:ctx.from.id},
      {
        $set: {city:ctx.callbackQuery.data}
      }
    )
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    await ctx.scene.enter('changeAge')
});

changeCity.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('profile'))
);

export default changeCity;
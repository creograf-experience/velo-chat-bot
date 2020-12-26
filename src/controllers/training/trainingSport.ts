import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import sports from '../../sports.json';

const { leave } = Stage;
const trainingSport = new Scene('trainingSport');

trainingSport.enter(async (ctx: ContextMessageUpdate) => {  
  const keyboard = [];
  for (let sport of sports){
    keyboard.push([{text: sport.name, callback_data:sport.name}])
  }
  await ctx.reply('💪 Выберите спорт из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

trainingSport.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.deleteMessage();
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    ctx.session.sport=ctx.callbackQuery.data
    await ctx.scene.enter('trainingStartPoint');
});


trainingSport.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => {
    await ctx.scene.enter('trainingCity')
  })
);

export default trainingSport;
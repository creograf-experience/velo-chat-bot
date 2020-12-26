import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import { trainingTimeKeyboard } from '../../constant/constant';


const { leave } = Stage;
const trainingTime = new Scene('trainingTime');


trainingTime.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('🕐 Выберите или введите примерную длительность тренировки в часах',{
    reply_markup : {
      inline_keyboard: trainingTimeKeyboard
    }
  });
});

trainingTime.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) =>  await ctx.scene.enter('trainingDistantion'))
);

trainingTime.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.deleteMessage();
  await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
  ctx.session.timeTraining=ctx.callbackQuery.data
  ctx.scene.enter('trainingDescription')
});

trainingTime.hears(/^[0-9]*[.,]?[0-9]+$/g, async (ctx: ContextMessageUpdate) => {
    ctx.session.timeTraining=ctx.message.text+' ч'
    ctx.scene.enter('trainingDescription')
});

trainingTime.on('text', async (ctx: ContextMessageUpdate) => {
    ctx.reply('Вводите время в формате числа')
});

export default trainingTime;
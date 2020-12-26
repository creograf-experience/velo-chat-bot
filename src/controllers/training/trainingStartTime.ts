import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import { startTimeTraining } from '../../constant/constant';


const { leave } = Stage;
const trainingStartTime = new Scene('trainingStartTime');


trainingStartTime.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('🕐 Выберите время старта или введите его в формате чч:мм',{
    reply_markup : {
      inline_keyboard: startTimeTraining
    }
  })  
});

trainingStartTime.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.deleteMessage();
  await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
  ctx.session.startTime=ctx.callbackQuery.data
  ctx.scene.enter('trainingType')
});

trainingStartTime.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('trainingDateBegin'))
);

trainingStartTime.hears(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/g, async (ctx: ContextMessageUpdate) => {
    ctx.session.startTime=ctx.message.text
    ctx.scene.enter('trainingType')
});

trainingStartTime.on('text', async (ctx: ContextMessageUpdate) => {
    ctx.reply('Вводите дату в формате чч:мм')
});

export default trainingStartTime;
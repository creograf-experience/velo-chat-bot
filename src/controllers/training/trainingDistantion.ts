import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import { trainingDistantionKeyboard} from '../../constant/constant';

const { leave } = Stage;
const trainingDistantion = new Scene('trainingDistantion');


trainingDistantion.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('🏃 Выберите дистанцию или введите дистанцию в метрах',{
    reply_markup : {
      inline_keyboard: trainingDistantionKeyboard
    }
  });
});

trainingDistantion.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) =>  await ctx.scene.enter('trainingType'))
);

trainingDistantion.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.deleteMessage();
  await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
  ctx.session.distantion=ctx.callbackQuery.data
  ctx.scene.enter('trainingTime')
});

trainingDistantion.hears(/^[1-9]\d{1,10}$/g, async (ctx: ContextMessageUpdate) => {
    ctx.session.distantion=ctx.message.text+' м'
    ctx.scene.enter('trainingTime')
});

trainingDistantion.on('text', async (ctx: ContextMessageUpdate) => {
    ctx.reply('Вводите дистанцию в формате числа')
});

export default trainingDistantion;
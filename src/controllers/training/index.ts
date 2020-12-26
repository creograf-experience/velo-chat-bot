import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard, getTrainingKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Training from '../../models/Training';


const { leave } = Stage;
const training = new Scene('training');


training.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters training scene');
  const training = await Training.find({'idLeader':ctx.from.id});
  const { trainingKeyboard } = getTrainingKeyboard(ctx);
  deleteFromSession(ctx, 'trainingScene');
  if(training.length){
    const keyboard = [];
    for (let item of training){
      keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
    }
    await ctx.reply('💪 Ваши тренировки:',{
      reply_markup : {
        inline_keyboard: keyboard,
      }
    });
    await ctx.reply('Для просмотра полной информации нажмите на тренировку',trainingKeyboard)
  }else {
    await ctx.reply('На данный момент у вас нет созданных тренировок',trainingKeyboard)
  }
});

training.on('callback_query',async(ctx: ContextMessageUpdate) => {
  ctx.session.idTraining=ctx.callbackQuery.data;
  await ctx.scene.enter('allTraining');
});

training.command('saveme', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves training scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'trainingScene');
});

training.hears('◀️ Назад', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves training scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'trainingScene');
});

training.hears('💪 Создать тренировку', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('trainingCity'))
);

training.hears('❎ Удалить тренировку', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('deleteTraining'))
);

export default training;
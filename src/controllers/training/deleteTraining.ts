import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Training from '../../models/Training';
import moment from 'moment';

const { leave } = Stage;
const deleteTraining = new Scene('deleteTraining');


deleteTraining.enter(async (ctx: ContextMessageUpdate) => {
  const training = await Training.find({'idLeader':ctx.from.id});
  const { backKeyboard } = getBackKeyboard(ctx);
  if(training.length){
    const keyboard = [];
    for (let item of training){
      keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
    }
    await ctx.reply('❎ Для удаление тренировки нажмите на тренировку',backKeyboard)
    await ctx.reply('Ваши тренировки:',{
      reply_markup : {
        inline_keyboard: keyboard,
      }
    });
  }else {
    await ctx.reply('На данный момент у вас нет созданных тренировок',backKeyboard)
  }
  
});

deleteTraining.on('callback_query',async(ctx: ContextMessageUpdate) => {
    await ctx.deleteMessage();
    await Training.findByIdAndDelete(ctx.callbackQuery.data);
    const training = await Training.find({'idLeader':ctx.from.id});
    const { backKeyboard } = getBackKeyboard(ctx);
    if(training.length){
        const keyboard = [];
        for (let item of training){
          keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply('Ваши тренировки:',{
          reply_markup : {
            inline_keyboard: keyboard,
          }
        });
      }else {
        await ctx.reply('Вы удалили все ваши тренировки',backKeyboard)
      }
});

deleteTraining.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('training'))
);



export default deleteTraining;
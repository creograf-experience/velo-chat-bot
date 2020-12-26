import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import { getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import moment from 'moment';
import Subscribe from '../../models/Subscribe';

const { leave } = Stage;
const deleteSubscribe = new Scene('deleteSubscribe');


deleteSubscribe.enter(async (ctx: ContextMessageUpdate) => {
  const subscribe= await Subscribe.find({'userId':ctx.from.id});
  const { backKeyboard } = getBackKeyboard(ctx);
  if(subscribe.length){
    const keyboard = [];
    for (let item of subscribe){
        if(item.typeSport.length) keyboard.push([{text: `${item.city}, ${item.typeSport}`, callback_data:item._id}])
        else keyboard.push([{text: `${item.city}`, callback_data:item._id}])
    }
    await ctx.reply('❎ Для удаление подписки нажмите на неё',backKeyboard)
    await ctx.reply('Ваши подписки:',{
      reply_markup : {
        inline_keyboard: keyboard,
      }
    });
  }else {
    await ctx.reply('На данный момент у вас нет подписок',backKeyboard)
  }
  
});

deleteSubscribe.on('callback_query',async(ctx: ContextMessageUpdate) => {
    await ctx.deleteMessage();
    await Subscribe.findByIdAndDelete(ctx.callbackQuery.data);
    const subscribe = await Subscribe.find({'userId':ctx.from.id});
    const { backKeyboard } = getBackKeyboard(ctx);
    if(subscribe.length){
        const keyboard = [];
        for (let item of subscribe){
            if(item.typeSport.length) keyboard.push([{text: `${item.city}, ${item.typeSport}`, callback_data:item._id}])
            else keyboard.push([{text: `${item.city}`, callback_data:item._id}])
        }
        await ctx.reply('Ваши подписки:',{
          reply_markup : {
            inline_keyboard: keyboard,
          }
        });
    }else {
      await ctx.reply('Вы удалили все ваши подписки',backKeyboard)
    }
});

deleteSubscribe.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('subscribe'))
);



export default deleteSubscribe;
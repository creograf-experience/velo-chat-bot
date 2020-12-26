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
import Training from '../../models/Training';
import _ from 'lodash';

const { leave } = Stage;
const subscribeInfo = new Scene('subscribeInfo');


subscribeInfo.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.deleteMessage();
  const subscribe = await Subscribe.findOne({'_id':ctx.session.idSubscribe});
  const training = await Training.find({'city':subscribe.city});
  const { backKeyboard } = getBackKeyboard(ctx);
  if(subscribe.typeSport.length){
    const find= subscribe.typeSport.split(',');
    const res=[];
    for (let item of training) {
        for (let el of find){
            if(item.typeTraining.match(el.trim())) res.push(item)
        }
    }
    const uniqRes=_.uniqBy(res,'_id');
    if(uniqRes.length){
        const keyboard = [];
        for (let item of uniqRes){
            keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply(`📃 Подписка: ${subscribe.city}, ${subscribe.typeSport}`,backKeyboard)
        await ctx.reply('Для просмотра полной информации нажмите на тренировку:',{
            reply_markup : {
                inline_keyboard: keyboard,
            }
        });
    } else {
        await ctx.reply(`Нет доступных тренировок по подписке.`,backKeyboard)
    }
  } else {
      if(training.length){
        const keyboard = [];
        for (let item of training){
            keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply(`📃 Подписка: ${subscribe.city}`,backKeyboard)
        await ctx.reply('Для просмотра полной информации нажмите на тренировку:',{
            reply_markup : {
                inline_keyboard: keyboard,
            }
        });
      } else {
        await ctx.reply(`Нет доступных тренировок по подписке.`,backKeyboard)
      }
  }  
});

subscribeInfo.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.session.idSubscribeTraining=ctx.callbackQuery.data;
    await ctx.scene.enter('allSubscribeInfo');
});


subscribeInfo.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('subscribe'))
);



export default subscribeInfo;
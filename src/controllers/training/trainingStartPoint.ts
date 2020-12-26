import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';


const { leave } = Stage;
const trainingStartPoint = new Scene('trainingStartPoint');


trainingStartPoint.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('📍 Введите название места старта или укажите точку на карте');
});

trainingStartPoint.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('trainingSport'))
);

trainingStartPoint.on(['text','location'], async (ctx: ContextMessageUpdate) => {
  if(ctx.message.text){
    ctx.session.startPoint=ctx.message.text
  }else{
    ctx.session.startPointLocation=ctx.message.location
  } 
    await ctx.scene.enter('trainingDateBegin')
});

export default trainingStartPoint;
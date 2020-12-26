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
const allTraining = new Scene('allTraining');


allTraining.enter(async (ctx: ContextMessageUpdate) => {
  const training = await Training.findOne({'_id':ctx.session.idTraining});
  const { backKeyboard } = getBackKeyboard(ctx);
  if(training.startPointLocation){
    await ctx.reply(`Информация о тренировке:
Город: ${training.city}
Спорт: ${training.typeSport}
Дата начала тренировки: ${training.startDate}
Время старта: ${training.startTime}
Сложность тренировки: ${training.typeTraining}
Дистанция в метрах: ${training.distantion}
Длительность тренировки: ${training.timeTraining}
Описание тренировки: ${training.descriptionTraining}
Чат тренировки: ${training.chatUrl}
  `
  ,backKeyboard)
    await ctx.reply('Точка старта:')
    await ctx.replyWithLocation(training.startPointLocation.latitude,training.startPointLocation.longitude)
  } else {
    await ctx.reply(`Информация о тренировке:
Город: ${training.city}
Спорт: ${training.typeSport}
Дата начала тренировки: ${training.startDate}
Точка старта: ${training.startPoint}
Время старта: ${training.startTime}
Сложность тренировки: ${training.typeTraining}
Дистанция: ${training.distantion}
Длительность тренировки: ${training.timeTraining}
Описание тренировки: ${training.descriptionTraining}
Чат тренировки: ${training.chatUrl}
  `
  ,backKeyboard)
  }
});


allTraining.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('training'))
);



export default allTraining;
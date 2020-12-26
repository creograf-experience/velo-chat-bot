import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Training from '../../models/Training';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

const { leave } = Stage;
const trainingDescription = new Scene('trainingDescription');


trainingDescription.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('📋 Введите описание тренировки');
});

trainingDescription.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('trainingTime'))
);

trainingDescription.on('text', async (ctx: ContextMessageUpdate) => {
    ctx.session.description=ctx.message.text;
    const leaderUserName=ctx.from.username ? ctx.from.username : '';
    const now = new Date().getTime();
    const chatTitle=ctx.session.startDate+' '+ctx.session.city+' '+ctx.session.sport+' '+ctx.session.distantion;
    const newTraining = new Training({
        _id:uuidv4(),
        created:now,
        city:ctx.session.city,
        startPoint:ctx.session.startPoint,
        typeTraining:ctx.session.typeSport,
        distantion:ctx.session.distantion,
        timeTraining:ctx.session.timeTraining,
        descriptionTraining:ctx.session.description,
        chatUrl:'',
        idLeader:ctx.from.id,
        typeSport:ctx.session.sport,
        startTime:ctx.session.startTime,
        startPointLocation:ctx.session.startPointLocation,
        titleChat:chatTitle
        startDate:ctx.session.startDate,
        checkDate:ctx.session.checkDate,
        leaderUserName: leaderUserName
    });
    await newTraining.save();
    if(leaderUserName.length){
      await ctx.reply('Отлично, тренировка создана, скоро вы будете добавлены в чат');
    } else {
      await ctx.reply('Отлично, тренировка создана, для автоматического добавления в чат заполните ваш ник в настройках Telegram');
    }
    await ctx.scene.enter('training')
});

export default trainingDescription;
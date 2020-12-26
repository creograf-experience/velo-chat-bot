import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard, getMainKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Calendar from 'telegraf-calendar-telegram';
import moment from 'moment';

const { leave } = Stage;
const trainingDateBegin = new Scene('trainingDateBegin');

const calendar = new Calendar(trainingDateBegin,{
	startWeekDay: 1,
	weekDayNames: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
	monthNames: [
		"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
		"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
	]
})

var calendarFunc=async (ctx,text)=>{
    const today = new Date();
    const minDate = new Date();
    minDate.setMonth(today.getMonth() - 5);
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 5);
    maxDate.setDate(today.getDate());
    await ctx.reply(text, calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar())
}

calendar.setDateListener(async(ctx, date) => {
    await ctx.deleteMessage();
    ctx.session.startDate=moment(date).format('DD.MM.YYYY');
    ctx.session.checkDate=moment(date).format('YYYYMMDD');
    await ctx.reply(`Вы выбрали датой тренировки: ${moment(date).format('DD.MM.YYYY')}`) 
    await ctx.scene.enter('trainingStartTime')
)});

trainingDateBegin.enter(async (ctx: ContextMessageUpdate) => {
  calendarFunc(ctx,'📆 Выберите дату старта тренировки')
});


trainingDateBegin.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => { await ctx.scene.enter('trainingStartPoint')})
);

export default trainingDateBegin;
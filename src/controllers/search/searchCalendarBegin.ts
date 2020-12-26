import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard, getMainKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Calendar from 'telegraf-calendar-telegram';
import moment from 'moment';

const { leave } = Stage;
const searchCalendarBegin = new Scene('searchCalendarBegin');

const calendar = new Calendar(searchCalendarBegin,{
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
    ctx.session.searchBeginDate=moment(date).format('DD.MM.YYYY');
    ctx.session.beginCheck=moment(date).format('YYYYMMDD');
    await ctx.reply(`Вы выбрали начальной датой: ${moment(date).format('DD.MM.YYYY')}`) 
    await ctx.scene.enter('searchCalendarEnd')
)});

searchCalendarBegin.enter(async (ctx: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(ctx);
  await ctx.reply('Тут вы можете выбрать диапозон дат для поиска тренировки',backKeyboard);
  calendarFunc(ctx,'📆 Выберите начальную дату')
});


searchCalendarBegin.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => { await ctx.scene.enter('search')})
);

export default searchCalendarBegin;
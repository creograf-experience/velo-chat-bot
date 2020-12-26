import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard, getMainKeyboard } from '../../util/keyboards';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import Calendar from 'telegraf-calendar-telegram';
import moment from 'moment';

const { leave } = Stage;
const searchCalendarEnd = new Scene('searchCalendarEnd');

const calendar = new Calendar(searchCalendarEnd,{
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

calendar.setDateListener(async (ctx, date) => {
    moment.suppressDeprecationWarnings = true;
    const formatDateEnd=moment(date).format('YYYYMMDD');
    if(formatDateEnd>ctx.session.beginCheck){
        await ctx.deleteMessage();
        ctx.session.searchEndDate=moment(date).format('DD.MM.YYYY');
        ctx.session.endCheck=moment(date).format('YYYYMMDD');
        await ctx.reply(`Вы выбрали конечной датой: ${moment(date).format('DD.MM.YYYY')}`) 
        await ctx.scene.enter('search')
    } else {
        await ctx.deleteMessage();
        await ctx.reply(`Вы не можете выбрать конечную дату раньше начальной`);
        calendarFunc(ctx,'📆 Выберите конечную дату')
    }

)});

searchCalendarEnd.enter(async (ctx: ContextMessageUpdate) => {
  calendarFunc(ctx,'📆 Выберите конечную дату')
});


searchCalendarEnd.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => { await ctx.scene.enter('searchCalendarBegin')})
);

export default searchCalendarEnd;
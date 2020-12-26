import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import { deleteFromSession } from '../../util/session';
import { getMainKeyboard, getSearchKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const search = new Scene('search');

search.enter(async (ctx: ContextMessageUpdate) => {  
  logger.debug(ctx, 'Enters search scene');
  const { searchKeyboard } = getSearchKeyboard(ctx);
  deleteFromSession(ctx, 'searchScene');
  if(ctx.session.searchBeginDate.length && ctx.session.searchEndDate.length){
    ctx.session.searchDate=`c ${ctx.session.searchBeginDate} по ${ctx.session.searchEndDate}`;
  }
  await ctx.reply(`🔎 Параметры поиска:
Город: ${ctx.session.searchCity}
Спорт: ${ctx.session.searchSport}
Сложность тренировки: ${ctx.session.searchType}
Диапазон создания тренировки: ${ctx.session.searchDate}`, searchKeyboard);
});

search.hears('📑 Выбор сложности', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('searchType'))
);

search.hears('📆 Выбор даты', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('searchCalendarBegin'))
);

search.hears('🔎 Найти', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('searchResult'))
);

search.hears('◀️ Назад', async (ctx: ContextMessageUpdate) => {
    logger.debug(ctx, 'Leaves search scene');
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply('Главное меню',mainKeyboard);
    deleteFromSession(ctx, 'searchScene');
  }
);

export default search;
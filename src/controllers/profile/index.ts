import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard, getProfileKeyboard, getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';


const { leave } = Stage;
const profile = new Scene('profile');


profile.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters profile scene');
  const { profileKeyboard } = getProfileKeyboard(ctx);
  const user = await User.findById(ctx.from.id);
  if(user.lastname===undefined) user.lastname=''
  if(user.username===undefined) user.username=''
  if(ctx.from.username===undefined) user.username=''
  deleteFromSession(ctx, 'profileScene');
  await ctx.reply(
    `👨 Ваши данные:
  Ник: ${user.username}
  Имя: ${user.firstname}
  Фамилия: ${user.lastname}
  Возраст: ${user.age}
  Пол: ${user.gender}
  Город: ${user.city}
  Виды спорта: ${user.sport}
  `,
    profileKeyboard
  );
});


profile.command('saveme', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves profile scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'profileScene');
});

profile.hears('◀️ Назад', async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves profile scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply('Главное меню',mainKeyboard);
  deleteFromSession(ctx, 'profileScene');
});

profile.hears('✏️ Изменить данные', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('changeCity'))
);

export default profile;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';


const { leave } = Stage;
const changeAge = new Scene('changeAge');


changeAge.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('Введите ваш возраст');
});

changeAge.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('changeCity'))
);

changeAge.hears(/^[1-9]\d{1,2}$/g, async (ctx: ContextMessageUpdate) => {
    await User.findOneAndUpdate(
      {_id:ctx.from.id},
      {
        $set: {age:ctx.message.text}
      }
    )
    await ctx.scene.enter('changeGender')
});

export default changeAge;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import logger from '../../util/logger';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';


const { leave } = Stage;
const changeGender = new Scene('changeGender');


changeGender.enter(async (ctx: ContextMessageUpdate) => {
  await ctx.reply('Выберите ваш пол',{
    reply_markup : {
      inline_keyboard: 
      [
        [
            {text:'👨 Мужской', callback_data:'Мужской'},
            {text:'👩 Женский', callback_data:'Женский'}
        ]
      ],
    }
  });
});


changeGender.action('Мужской',async(ctx: ContextMessageUpdate)=>{
  ctx.deleteMessage();
  await User.findOneAndUpdate(
    {_id:ctx.from.id},
    {
      $set: {gender:ctx.callbackQuery.data}
    }
  )
  await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
  await ctx.scene.enter('changeSport');
})

changeGender.action('Женский',async(ctx: ContextMessageUpdate)=>{
    ctx.deleteMessage();
    await User.findOneAndUpdate(
      {_id:ctx.from.id},
      {
        $set: {gender:ctx.callbackQuery.data}
      }
    )
    await ctx.reply('Вы выбрали: '+ctx.callbackQuery.data);
    await ctx.scene.enter('changeSport');
  })

changeGender.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('changeAge'))
);

export default changeGender;
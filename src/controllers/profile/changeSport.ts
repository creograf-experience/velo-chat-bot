import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import sports from '../../sports.json';

const { leave } = Stage;
const changeSport = new Scene('changeSport');
let selected=[];

changeSport.enter(async (ctx: ContextMessageUpdate) => {  
  const keyboard = [];
  for (let sport of sports){
    keyboard.push([{text: sport.name, callback_data:sport.name}])
  }
  keyboard.push([{text:"Готово", callback_data:"Готово"}])  
  await ctx.reply('💪 Выберите спорт из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

changeSport.on('callback_query',async(ctx: ContextMessageUpdate) => {
    if(ctx.callbackQuery.data!=='Готово'){
        if(selected.find(item=>item===ctx.callbackQuery.data)){
            selected=selected.filter(item=>item!==ctx.callbackQuery.data)
        } else {
            selected.push(ctx.callbackQuery.data)
        }
        const keyboard = [];
        for (let sport of sports){
            keyboard.push([{text:selected.find(item=>item===sport.name) ? '✅ '+sport.name : sport.name, callback_data:sport.name}])
        }
        keyboard.push([{text:"Готово", callback_data:"Готово"}]) 
        await ctx.editMessageText('Выберите спорт из списка',{
            reply_markup : {
            inline_keyboard: keyboard,
            }
        });
    } else {
        const stringSports=selected.join(', ');
        await User.findOneAndUpdate(
            {_id:ctx.from.id},
            {
              $set: {sport:stringSports}
            }
        )
        await ctx.deleteMessage();
        if(selected.length){
            await ctx.reply('Вы выбрали: '+stringSports);
        } else {
            await ctx.reply('Вы не выбрали не один из видов спорта');
        }
        await ctx.reply('✅ Отлично, данные обновлены');
        selected=[];
        await ctx.scene.enter('profile');
    }    
});


changeSport.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => {
    selected=[]
    await ctx.scene.enter('changeGender')
  })
);

export default changeSport;
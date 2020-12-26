import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import types from '../../type.json';
import { getBackKeyboard } from '../../util/keyboards';

const { leave } = Stage;
const searchType = new Scene('searchType');
let selected=[];

searchType.enter(async (ctx: ContextMessageUpdate) => {  
  const { backKeyboard } = getBackKeyboard(ctx);  
  const keyboard = [];
  for (let type of types){
    keyboard.push([{text: type.name, callback_data:type.name}])
  }
  keyboard.push([{text:"Готово", callback_data:"Готово"}])  
  await ctx.reply('Для поиска вы можете выбрать сложность тренировки',backKeyboard);
  await ctx.reply('Выберите сложность тренировки из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

searchType.on('callback_query',async(ctx: ContextMessageUpdate) => {
    if(ctx.callbackQuery.data!=='Готово'){
        if(selected.find(item=>item===ctx.callbackQuery.data)){
            selected=selected.filter(item=>item!==ctx.callbackQuery.data)
        } else {
            selected.push(ctx.callbackQuery.data)
        }
        const keyboard = [];
        for (let type of types){
            keyboard.push([{text:selected.find(item=>item===type.name) ? '✅ '+type.name : type.name, callback_data:type.name}])
        }
        keyboard.push([{text:"Готово", callback_data:"Готово"}]) 
        await ctx.editMessageText('Выберите сложность тренировки из списка',{
            reply_markup : {
            inline_keyboard: keyboard,
            }
        });
    } else {
        const stringSports=selected.join(', ');
        
        await ctx.deleteMessage();
        if(selected.length){
            await ctx.reply('Вы выбрали: '+stringSports);
        } else {
            await ctx.reply('Вы не выбрали сложность тренировки');
        }
        ctx.session.searchType=stringSports;
        selected=[];
        await ctx.scene.enter('search');
    }    
});


searchType.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => {
    selected=[]
    await ctx.scene.enter('search')
  })
);

export default searchType;
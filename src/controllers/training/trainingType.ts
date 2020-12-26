import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import types from '../../type.json';

const { leave } = Stage;
const trainingType = new Scene('trainingType');
let selected=[];
const enterKeyboard = [];
  for (let type of types){
    enterKeyboard.push([{text: type.name, callback_data:type.name}])
  }
  enterKeyboard.push([{text:"Готово", callback_data:"Готово"}])  


trainingType.enter(async (ctx: ContextMessageUpdate) => {  
  await ctx.reply('Выберите сложность тренировки',{
    reply_markup : {
      inline_keyboard: enterKeyboard,
    }
  });
});

trainingType.on('callback_query',async(ctx: ContextMessageUpdate) => {
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
        await ctx.editMessageText('Выберите сложность тренировки',{
            reply_markup : {
            inline_keyboard: keyboard,
            }
        });
    } else {
        const stringSports=selected.join(', ');
        await ctx.deleteMessage();
        if(selected.length){
            await ctx.reply('Вы выбрали: '+stringSports);
            ctx.session.typeSport=stringSports;
            selected=[];
            await ctx.scene.enter('trainingDistantion')
        } else {
            await ctx.reply('Вы не выбрали не одну из сложностей тренировки, для продолжения нужно выбрать сложность тренировки');
            await ctx.reply('Выберите сложность тренировки',{
              reply_markup : {
              inline_keyboard: enterKeyboard,
              }
          });
        }
    }    
});


trainingType.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => {
    selected=[]
    await ctx.scene.enter('trainingStartTime')
  })
);

export default trainingType;
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import User from '../../models/User';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import types from '../../type.json';
import Subscribe from '../../models/Subscribe';
import uuidv4 from 'uuid/v4';

const { leave } = Stage;
const subscribeType = new Scene('subscribeType');
let selected=[];

subscribeType.enter(async (ctx: ContextMessageUpdate) => {  
  const keyboard = [];
  for (let type of types){
    keyboard.push([{text: type.name, callback_data:type.name}])
  }
  keyboard.push([{text:"Готово", callback_data:"Готово"}])  
  await ctx.reply('Выберите сложность тренировки из списка',{
    reply_markup : {
      inline_keyboard: keyboard,
    }
  });
});

subscribeType.on('callback_query',async(ctx: ContextMessageUpdate) => {
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
        selected=[];
        const newSubscribe = new Subscribe({
            _id:uuidv4(),
            userId:ctx.from.id,
            typeSport:stringSports,
            city:ctx.session.subscribeCity
        });
        await newSubscribe.save();
        await ctx.reply('Отлично, подписка создана');
        await ctx.scene.enter('subscribe');
    }    
});


subscribeType.hears('◀️ Назад', 
  updateUserTimestamp,
  asyncWrapper(async (ctx:ContextMessageUpdate) => {
    selected=[]
    await ctx.scene.enter('subscribeCity')
  })
);

export default subscribeType;
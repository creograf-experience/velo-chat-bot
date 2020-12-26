import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getBackKeyboard } from '../../util/keyboards';
import { deleteFromSession } from '../../util/session';
import { updateUserTimestamp } from '../../middlewares/update-user-timestamp';
import asyncWrapper from '../../util/error-handler';
import moment from 'moment';
import Training from '../../models/Training';
import _ from 'lodash';

const { leave } = Stage;
const searchResult = new Scene('searchResult');


searchResult.enter(async (ctx: ContextMessageUpdate) => {
  const training = await Training.find({'city':ctx.session.searchCity, typeSport:ctx.session.searchSport});
  if (ctx.session.searchType.length && ctx.session.searchBeginDate.length) {
    searchDateAndType(ctx,training)
    return
  }
  if (ctx.session.searchType.length) {
    searchType(ctx,training)
    return
  }
  if (ctx.session.searchBeginDate.length) {
    searchDate(ctx,training)
    return
  } 
  if (!ctx.session.searchType.length && !ctx.session.searchBeginDate.length) {
    searchNoDateAndType(ctx,training)
    return
  }

});

searchResult.on('callback_query',async(ctx: ContextMessageUpdate) => {
    ctx.session.idSearchTraining=ctx.callbackQuery.data;
    await ctx.scene.enter('allSearchInfo');
});

searchResult.hears('◀️ Назад', 
    updateUserTimestamp,
    asyncWrapper(async (ctx:ContextMessageUpdate) => await ctx.scene.enter('search'))
);

var searchDateAndType = async (ctx,training) => {
    const { backKeyboard } = getBackKeyboard(ctx);
    const res=[];
    for(let item of training) {
        if(ctx.session.beginCheck<=item.checkDate && ctx.session.endCheck>=item.checkDate) res.push(item)
    }
    if(res.length){
        const find= ctx.session.searchType.split(',');
        const resType=[];
        for (let item of res) {
            for (let el of find){
                if(item.typeTraining.match(el.trim())) resType.push(item)
            }
        }
        const uniqRes=_.uniqBy(resType,'_id');
        if(uniqRes.length){
            const keyboard = [];
            for (let item of uniqRes){
                keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
            }
            await ctx.reply('🔎 Тренировки:',{
                reply_markup : {
                    inline_keyboard: keyboard,
                }
            });
            await ctx.reply(`Для полной информации нажмите на тренировку`,backKeyboard)
        } else {
            await ctx.reply(`Не найдено тренировок по данным параметрам`,backKeyboard)
        }
    }else {
        await ctx.reply(`Не найдено тренировок по данным параметрам`,backKeyboard)
    }

}

var searchDate = async (ctx,training) => {
    const { backKeyboard } = getBackKeyboard(ctx);
    const res=[];
    for(let item of training) {
        if(ctx.session.beginCheck<=item.checkDate && ctx.session.endCheck>=item.checkDate) res.push(item)
    }
    if(res.length){
        const keyboard = [];
        for (let item of res){
            keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply('🔎 Тренировки:',{
            reply_markup : {
                inline_keyboard: keyboard,
            }
        });
        await ctx.reply(`Для полной информации нажмите на тренировку`,backKeyboard)
    }else {
        await ctx.reply(`Не найдено тренировок по данным параметрам`,backKeyboard)
    }
}

var searchType = async (ctx,training) => {
    const { backKeyboard } = getBackKeyboard(ctx);
    const find= ctx.session.searchType.split(',');
    const res=[];
    for (let item of training) {
        for (let el of find){
            if(item.typeTraining.match(el.trim())) res.push(item)
        }
    }
    const uniqRes=_.uniqBy(res,'_id');
    if(uniqRes.length){
        const keyboard = [];
        for (let item of uniqRes){
            keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply('🔎 Тренировки:',{
            reply_markup : {
                inline_keyboard: keyboard,
            }
        });
        await ctx.reply(`Для полной информации нажмите на тренировку`,backKeyboard)
    } else {
        await ctx.reply(`Не найдено тренировок по данным параметрам`,backKeyboard)
    }
}

var searchNoDateAndType = async (ctx,training) => {
    const { backKeyboard } = getBackKeyboard(ctx);
    if(training.length){
        const keyboard = [];
        for (let item of training){
            keyboard.push([{text: `${item.city}, ${item.typeSport}, ${item.distantion}, ${item.typeTraining}`, callback_data:item._id}])
        }
        await ctx.reply('🔎 Тренировки:',{
            reply_markup : {
                inline_keyboard: keyboard,
            }
        });
        await ctx.reply(`Для полной информации нажмите на тренировку`,backKeyboard)
    } else {
        await ctx.reply(`Не найдено тренировок по данным параметрам.`,backKeyboard)
    }    
}

export default searchResult;
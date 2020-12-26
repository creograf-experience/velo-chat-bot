import { Markup, ContextMessageUpdate } from 'telegraf';

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getBackKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = '◀️ Назад';
  let backKeyboard: any = Markup.keyboard([backKeyboardBack]);

  backKeyboard = backKeyboard.resize().extra();

  return {
    backKeyboard,
    backKeyboardBack
  };
};

/**
 * Returns main keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getMainKeyboard = (ctx: ContextMessageUpdate) => {
  const mainKeyboardMySub = '📃 Мои подписки';
  const mainKeyboardMyTraining = '💪 Мои тренировки';
  const mainKeyboardProfile = '👨 Мои данные';
  const mainKeyboardSearch = '🔎 Поиск';
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardMySub] as any,
    [mainKeyboardMyTraining],
    [mainKeyboardProfile],
    [mainKeyboardSearch]
  ]);
  mainKeyboard = mainKeyboard.resize().extra();

  return {
    mainKeyboard,
    mainKeyboardSearch,
    mainKeyboardMyTraining,
    mainKeyboardMySub
  };
};

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getProfileKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = '◀️ Назад';
  const changeProfile = '✏️ Изменить данные'
  let profileKeyboard: any = Markup.keyboard([
    [changeProfile],
    [backKeyboardBack]
  ]);

  profileKeyboard = profileKeyboard.resize().extra();

  return {
    profileKeyboard,
    backKeyboardBack,
    changeProfile
  };
};

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getTrainingKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = '◀️ Назад';
  const createTraining = '💪 Создать тренировку';
  const deleteTraining = '❎ Удалить тренировку';
  let trainingKeyboard: any = Markup.keyboard([
    [createTraining],
    [deleteTraining],
    [backKeyboardBack]
  ]);

  trainingKeyboard = trainingKeyboard.resize().extra();

  return {
    trainingKeyboard,
    backKeyboardBack,
    createTraining,
    deleteTraining
  };
};

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getSubscribeKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = '◀️ Назад';
  const createSubscribe = '✅ Подписаться на тренировки';
  const deleteSubscribe = '❎ Отписаться от подписок';
  let subscribeKeyboard: any = Markup.keyboard([
    [createSubscribe],
    [deleteSubscribe],
    [backKeyboardBack]
  ]);

  subscribeKeyboard = subscribeKeyboard.resize().extra();

  return {
    subscribeKeyboard,
    backKeyboardBack,
    createSubscribe,
    deleteSubscribe
  };
};

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getSearchKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = '◀️ Назад';
  const chooseType = '📑 Выбор сложности';
  const chooseDate = '📆 Выбор даты';
  const search = '🔎 Найти';
  let searchKeyboard: any = Markup.keyboard([
    [chooseType],
    [chooseDate],
    [search],
    [backKeyboardBack]
  ]);

  searchKeyboard = searchKeyboard.resize().extra();

  return {
    searchKeyboard,
    backKeyboardBack,
    chooseType,
    chooseDate,
    search
  };
};
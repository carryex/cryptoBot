import { Order } from 'src/order/order.entity';
import { Markup } from 'telegraf';
export const BotName = 'cryptoExchangeBot';
export const MARKET_SCENE = 'MARKET_SCENE';
export const WALLET_SCENE = 'WALLET_SCENE';
export const AMOUNT_SCENE = 'AMOUNT_SCENE';
export const APPROVE_SCENE = 'APPROVE_SCENE';
export const ORDER_SCENE = 'ORDER_SCENE';
export const APPROVE_TRANSACTION_SCENE = 'APPROVE_TRANSACTION_SCENE';
export const HOW_SCENE = 'HOW_SCENE';
export const PULL_STATUS_SCENE = 'PULL_STATUS_SCENE';
export const SUPPORT_SCENE = 'SUPPORT_SCENE';
export const ORDERS_SCENE = 'ORDERS_SCENE';
export const CANCEL_ORDER_SCENE = 'CANCEL_ORDER_SCENE';
export const ESTATE_SCENE = 'ESTATE_SCENE';
export const URGENT_SCENE = 'URGENT_SCENE';
export const EUR_TO_USDT_AMOUNT_SCENE = 'EUR_TO_USDT_AMOUNT_SCENE';
export const EUR_TO_USDT_WALLET_SCENE = 'EUR_TO_USDT__WALLET_SCENE';
export const EUR_TO_USDT_APPROVE_SCENE = 'EUR_TO_USDT_APPROVE_SCENE';
export const PULL_FILLED_SCENE = 'PULL_FILLED_SCENE';

export const BOT_WALLET = 'TGx293hyPSQfExbjbVzbPgcciETJrTZfbF';

export const MIN_AMOUNT = 30;
export const COMMANDS = {
  START: 'start',
  USDT_TO_EUR: 'USDT_TO_EUR',
  EUR_TO_USDT: 'EUR_TO_USDT',
  ESTATE: 'ESTATE',
  ENTER_PULL: 'ENTER_PULL',
  HOW: 'HOW',
  URGENT: 'URGENT',
  MAIN_MENU: 'MAIN_MENU',
  PULL_STATUS: 'PULL_STATUS',
  MY_ORDERS: 'MY_ORDERS',
  BACK: 'BACK',
  SUPPORT: 'SUPPORT',
  MAX_USDT: 'MAX_USDT',
  CANCEL_ORDER: 'CANCEL_ORDER',
  APPROVE_TRANSACTION: 'APPROVE_TRANSACTION',
  OK: 'OK',
  CONTINUE: 'CONTINUE',
};

export const BUTTONS = {
  BACK: Markup.button.callback('⬅ назад ️', 'BACK'),
  SUPPORT: Markup.button.callback('ℹ️ поддержка', COMMANDS.SUPPORT),
  PULL_STATUS: Markup.button.callback(
    '❔ статистика пула',
    COMMANDS.PULL_STATUS,
  ),
  ORDERS: Markup.button.callback('📈 мои заявки ', COMMANDS.MY_ORDERS),
  HOW: Markup.button.callback('как это работает? 🤔', COMMANDS.HOW),
  MAIN_MENU: Markup.button.callback('🏠 главное меню', COMMANDS.MAIN_MENU),
  CANCEL_ORDER: Markup.button.callback(
    '↩️ отмена заявки',
    COMMANDS.CANCEL_ORDER,
  ),
  APPROVE_TRANSACTION: Markup.button.callback(
    '🆗 я перевёл',
    COMMANDS.APPROVE_TRANSACTION,
  ),
  OK: Markup.button.callback('✅', COMMANDS.OK),
  CONTINUE: Markup.button.callback('➡️ продолжить', COMMANDS.CONTINUE),
  USDT_TO_EUR: Markup.button.callback('USDT –> EUR', COMMANDS.USDT_TO_EUR),
  EUR_TO_USDR: Markup.button.callback('EUR –> USDT', COMMANDS.EUR_TO_USDT),
  ESTATE: Markup.button.callback(
    'покупка /продажа недвижимости',
    COMMANDS.ESTATE,
  ),
  JOIN_PULL: Markup.button.callback(
    '🚀 Учавстовать в пуле',
    COMMANDS.ENTER_PULL,
  ),
  URGENT: Markup.button.callback('срочный вывод ⚡️', COMMANDS.URGENT),
  MAX: (balance: number) =>
    Markup.button.callback(`max: ${balance}`, COMMANDS.MAX_USDT),
};

const WALLET_NUMBER = `Укажите номер кошелька в сети TRC.\n⚠️ (проверьте правильность ввода номера) ⚠️`;
const AMOUNT = `введите пересылаемую сумму в USDT\n(min ${MIN_AMOUNT} )`;
const ordersTemplate = (orders: Order[]): string =>
  orders.length
    ? orders
        .map((o) => {
          return `Заявка ${o.id}\nwallet: ${o.wallet}\namount: ${o.amount}\nstatus: ${o.status}`;
        })
        .join(`\n\n`)
    : 'Заявок нет';

export const TEXT = {
  START: `Привет! У нас можно поменять USDT (TRC20) на EUR cash и обратно. 🔒⚡️💶🧩\nКупить / продать недвижимость за криптовалюту🏡`,
  MARKET: `Выберите подходящий вариант обмена :`,
  WALLET_NUMBER,
  NOT_ENOUGHT_MONEY: (balance: string, min: number) =>
    `На вашем кошельке не достаточно средств. (баланс вашего кошелька: ${balance})\nМинимальная сумма для вывода: ${min}.\nВведите номер кошелька с минимальной суммой для участия в пулле`,
  WALLET_NOT_FOUND: `Кошелек не найден в сети блокчейн.\n${WALLET_NUMBER}`,
  AMOUNT,
  APPROVE: `Ваша заявка принята! ✅\nВы можете перевести средства до начала пула, или дождаться уведомления о его завершении.\n⚠️ ️отменить заявку в пул можно только до момента осуществления транзакции ⚠️\nномер кошелька для перевода: \n${BOT_WALLET}`,
  HOW: `💠 Здесь вы можете купить криптовалюту за наличные евро или вывести ее через совместный пул.\nсобираем пул заявок на обмен, с помошью бота.\nвы переводите USDT(TRC20) на наш кошелёк до 15:00 текущего дня.\nналичные выдаются на следующий день в назначенном месте.\nвы прекрасны\n\n* Cрочный перевод от 10 000 USDT, комиссия 5%\n\n🛡 Бот выступает гарантом и удерживает монеты на время сделки. Комиссия на покупку – 0%, на продажу – 4%.`,
  PULL_STATUS: (fill: number) =>
    `Пул заполнена на ${fill} %\nтут тоже можно указать время когда пул закрывается и собирается по часам.`,
  SUPPORT: `что вы хотите узнать?`,
  ORDERS: ordersTemplate,
  ESTATE: `Тут будет инфа по покупке / продаже + реклама ?`,
  CANCEL_ORDER: `Ваша заявка успешно отменена`,
  ORDER: (id: number, wallet: string, amount: number, status: string) =>
    `Заявка №${id}\nwallet: ${wallet}\namount: ${amount}\nstatus: ${status}`,
  URGENT: `🔥 В случае срочной обналички комиссия составит 5% от суммы.`,
  EUR_TO_USDT_AMOUNT: `введите сумму, на которую вы хотите купить  USDT`,
  EUR_TO_USDT_WALLET: `Введите номер вашего кошелька для получения USDT (TRC20)`,
  EUR_TO_USDT_APPROVE: (order: Order) =>
    `${ordersTemplate([order])}\n\nмы свяжемся с вами для передачи средств`,
  INVALID_AMOUNT: `Сумма для перевода должна быть больше минимальной.\n${AMOUNT}`,
  INVALID_AMOUNT_FORMAT: `Сумма для перевода должна быть числом и не содежать букв.\n${AMOUNT}`,
  PULL_FILLED: (amout: number) =>
    `Мы собрали достаточное количество заявок и запускаем пул! 🚀\nУбедитесь, что вы перевели ${amout}_USDT на кошелёк ${BOT_WALLET}\nвремя для перевода ЗАВТРА 13:13`,
};

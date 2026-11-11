import { ref } from 'vue'

const translations = {
  en: {
    home: 'Home', menu: 'Menu', reservations: 'Reservations', track: 'Track order', cart: 'Cart',
    bookTable: 'Book a table', language: 'Language', darkMode: 'Dark mode', lightMode: 'Light mode',
    seasonalKitchen: 'Seasonal kitchen · Est. 2014', heroTitle: 'Flavors that', heroTitleAccent: 'bring us together.',
    heroCopy: 'Modern comfort food, sourced with care and served with heart. Every plate is an invitation to stay a little longer.',
    exploreMenu: 'Explore our menu', reserveTable: 'Reserve a table', openToday: 'Open today',
    reviews: '1,200+ reviews', fromKitchen: 'From our kitchen', chefFavorites: 'Chef’s favorites', fullMenu: 'View full menu',
    philosophy: 'Our philosophy', simpleIngredients: 'Simple ingredients,', extraordinaryMoments: 'extraordinary moments.',
    ourStory: 'For more than a decade, Savory has brought people together over thoughtful food, generous plates, and genuine hospitality. We cook with the rhythm of the seasons and work closely with local growers, fishermen, and artisan makers.',
    discoverMenu: 'Discover our menu', experience: 'The Savory experience', goodCompany: 'Made for good company',
    experienceCopy: 'Lunch, long dinners, celebrations, or a quiet glass at the bar—every table is treated with the same care.',
    seasonalIngredients: 'Seasonal ingredients', seasonalCopy: 'Our menu follows the harvest, with produce sourced from growers and producers we know personally.',
    honestCooking: 'Honest cooking', honestCopy: 'We let exceptional ingredients speak for themselves through careful, contemporary techniques.',
    warmHospitality: 'Warm hospitality', hospitalityCopy: 'Thoughtful service creates a relaxed room where every guest feels genuinely welcome.',
    yearsHospitality: 'Years of hospitality', seasonalDishes: 'Seasonal dishes', localPartners: 'Local partners', guestRating: 'Guest rating',
    aroundTable: 'Around our table', glimpse: 'A glimpse of Savory', guestStory: 'Guest story',
    testimonial: '“A room full of warmth, dishes with real personality, and service that makes you want to return.”',
    tableWaiting: 'Your table is waiting', dineWithUs: 'Come dine with us',
    hoursCopy: 'Open daily for lunch and dinner. Walk-ins are welcome, while reservations are recommended for evenings and weekends.',
    ourMenu: 'Our menu', menuIntro: 'Seasonal ingredients, thoughtful preparation, and flavors made to share.',
    all: 'All', starters: 'Starters', mains: 'Mains', desserts: 'Desserts', drinks: 'Drinks', dishes: 'dishes', addOrder: 'Add to order',
    footerCopy: 'Thoughtfully prepared food, warm hospitality, and memorable evenings.', explore: 'Explore', visit: 'Visit',
    newsletter: 'Newsletter', email: 'Email address', subscribe: 'Subscribe', privacy: 'Privacy', terms: 'Terms',
    itemAdded: 'added to your cart.',
    yourOrder: 'Your order', shoppingCart: 'Shopping cart', emptyCart: 'Your cart is empty',
    emptyCartCopy: 'Explore our seasonal menu and find something delicious.', browseMenu: 'Browse menu',
    orderSummary: 'Order summary', continueCheckout: 'Continue to checkout', removeItem: 'Remove item',
    joinUs: 'Join us', details: 'Your details', name: 'Name', yourName: 'Your name',
    phoneNumber: 'Phone number', date: 'Date', time: 'Time', guests: 'Guests',
    requestReservation: 'Request reservation', reservationSuccess: 'Reservation submitted successfully.',
    finalStep: 'Final step', checkout: 'Checkout', deliveryAddress: 'Delivery address',
    addressPlaceholder: 'Street, building, apartment', paymentMethod: 'Payment method',
    cashOnDelivery: 'Cash on delivery', card: 'Card', placeOrder: 'Place order',
    orderSuccess: 'Order placed successfully. Opening order tracking...', status: 'Delivery status',
    trackOrder: 'Track your order', orderNumber: 'Order number', enterOrderNumber: 'Enter order number',
    trackButton: 'Track', confirmed: 'Confirmed', preparing: 'Preparing', onTheWay: 'On the way',
    contactDetails: 'Contact details', orderContactTitle: 'To complete your order',
    emailLabel: 'E-mail', continue: 'Continue', orderContact: 'ORDER CONTACT',
    notFound: 'Table not found', returnHome: 'Return home',
  },
  ru: {
    home: 'Главная', menu: 'Меню', reservations: 'Бронирование', track: 'Мой заказ', cart: 'Корзина',
    bookTable: 'Забронировать столик', language: 'Язык', darkMode: 'Тёмная тема', lightMode: 'Светлая тема',
    seasonalKitchen: 'Сезонная кухня · С 2014 года', heroTitle: 'Вкусы, которые', heroTitleAccent: 'объединяют.',
    heroCopy: 'Современная домашняя кухня из тщательно выбранных продуктов. Каждое блюдо приглашает вас задержаться подольше.',
    exploreMenu: 'Смотреть меню', reserveTable: 'Забронировать столик', openToday: 'Открыты сегодня',
    reviews: 'Более 1 200 отзывов', fromKitchen: 'Из нашей кухни', chefFavorites: 'Выбор шеф-повара', fullMenu: 'Все меню',
    philosophy: 'Наша философия', simpleIngredients: 'Простые ингредиенты,', extraordinaryMoments: 'незабываемые моменты.',
    ourStory: 'Уже более десяти лет Savory объединяет гостей благодаря продуманным блюдам, щедрым порциям и искреннему гостеприимству. Мы следуем сезонам и работаем с местными фермерами, рыбаками и ремесленниками.',
    discoverMenu: 'Открыть меню', experience: 'Впечатления Savory', goodCompany: 'Для хорошей компании',
    experienceCopy: 'Обед, долгий ужин, праздник или бокал в баре — каждому гостю мы дарим одинаковое внимание.',
    seasonalIngredients: 'Сезонные продукты', seasonalCopy: 'Наше меню меняется вслед за урожаем. Мы выбираем продукты у знакомых фермеров и производителей.',
    honestCooking: 'Честная кухня', honestCopy: 'Мы раскрываем вкус каждого ингредиента с помощью бережных современных техник.',
    warmHospitality: 'Тёплый приём', hospitalityCopy: 'Внимательный сервис создаёт непринуждённую атмосферу, в которой каждому гостю рады.',
    yearsHospitality: 'Лет гостеприимства', seasonalDishes: 'Сезонных блюд', localPartners: 'Местных партнёров', guestRating: 'Оценка гостей',
    aroundTable: 'За нашим столом', glimpse: 'Атмосфера Savory', guestStory: 'История гостя',
    testimonial: '«Здесь уютная атмосфера, блюда с характером и сервис, ради которого хочется вернуться».',
    tableWaiting: 'Ваш столик ждёт вас', dineWithUs: 'Приходите в гости',
    hoursCopy: 'Мы открыты ежедневно на обед и ужин. Будем рады гостям без брони, но на вечер и выходные рекомендуем забронировать столик.',
    ourMenu: 'Наше меню', menuIntro: 'Сезонные продукты, бережное приготовление и вкусы, которыми хочется делиться.',
    all: 'Все', starters: 'Закуски', mains: 'Основные блюда', desserts: 'Десерты', drinks: 'Напитки', dishes: 'блюд', addOrder: 'Добавить в заказ',
    footerCopy: 'Вкусная еда, тёплое гостеприимство и вечера, которые запоминаются.', explore: 'Разделы', visit: 'Контакты',
    newsletter: 'Рассылка', email: 'Электронная почта', subscribe: 'Подписаться', privacy: 'Конфиденциальность', terms: 'Условия',
    itemAdded: 'добавлено в корзину.',
    yourOrder: 'Ваш заказ', shoppingCart: 'Корзина', emptyCart: 'Корзина пуста',
    emptyCartCopy: 'Посмотрите сезонное меню и выберите что-нибудь вкусное.', browseMenu: 'Открыть меню',
    orderSummary: 'Ваш заказ', continueCheckout: 'Перейти к оформлению', removeItem: 'Удалить товар',
    joinUs: 'Будем рады видеть вас', details: 'Ваши данные', name: 'Имя', yourName: 'Ваше имя',
    phoneNumber: 'Номер телефона', date: 'Дата', time: 'Время', guests: 'Гости',
    requestReservation: 'Отправить запрос', reservationSuccess: 'Запрос на бронирование отправлен.',
    finalStep: 'Последний шаг', checkout: 'Оформление заказа', deliveryAddress: 'Адрес доставки',
    addressPlaceholder: 'Улица, дом, квартира', paymentMethod: 'Способ оплаты',
    cashOnDelivery: 'Оплата при получении', card: 'Картой', placeOrder: 'Оформить заказ',
    orderSuccess: 'Заказ оформлен. Открываем отслеживание...', status: 'Статус доставки',
    trackOrder: 'Отследить заказ', orderNumber: 'Номер заказа', enterOrderNumber: 'Введите номер заказа',
    trackButton: 'Найти', confirmed: 'Подтверждён', preparing: 'Готовится', onTheWay: 'В пути',
    contactDetails: 'Контактные данные', orderContactTitle: 'Чтобы оформить заказ',
    emailLabel: 'Электронная почта', continue: 'Продолжить', orderContact: 'ДАННЫЕ ДЛЯ ЗАКАЗА',
    notFound: 'Столик не найден', returnHome: 'На главную',
  },
  uz: {
    home: 'Bosh sahifa', menu: 'Menyu', reservations: 'Stol band qilish', track: 'Buyurtmani kuzatish', cart: 'Savat',
    bookTable: 'Stol band qilish', language: 'Til', darkMode: 'Qorong‘i rejim', lightMode: 'Yorug‘ rejim',
    seasonalKitchen: 'Mavsumiy taomlar · 2014-yildan', heroTitle: 'Bizni birlashtirgan', heroTitleAccent: 'ta’mlar.',
    heroCopy: 'Ehtiyotkorlik bilan tanlangan mahsulotlardan tayyorlangan zamonaviy taomlar. Har bir taom sizni uzoqroq qolishga chorlaydi.',
    exploreMenu: 'Menyuni ko‘rish', reserveTable: 'Stol band qilish', openToday: 'Bugun ochiq',
    reviews: '1 200 dan ortiq sharh', fromKitchen: 'Oshxonamizdan', chefFavorites: 'Bosh oshpaz tanlovi', fullMenu: 'To‘liq menyu',
    philosophy: 'Bizning falsafamiz', simpleIngredients: 'Oddiy masalliqlar,', extraordinaryMoments: 'unutilmas lahzalar.',
    ourStory: 'O‘n yildan ortiq vaqt davomida Savory mehmonlarni mazali taomlar va samimiy mehmondo‘stlik bilan birlashtirib kelmoqda. Biz mavsumga mos ishlaymiz va mahalliy dehqonlar hamda hunarmandlar bilan hamkorlik qilamiz.',
    discoverMenu: 'Menyuni ochish', experience: 'Savory taassurotlari', goodCompany: 'Yaxshi davra uchun',
    experienceCopy: 'Tushlik, uzoq kechki ovqat, bayram yoki barda sokin dam — har bir mehmon birdek e’tiborda.',
    seasonalIngredients: 'Mavsumiy mahsulotlar', seasonalCopy: 'Menyumiz hosil mavsumiga qarab yangilanadi va biz taniydigan ishlab chiqaruvchilardan mahsulot olamiz.',
    honestCooking: 'Samimiy pazandachilik', honestCopy: 'Ajoyib masalliqlarning tabiiy ta’mini zamonaviy usullar bilan ochib beramiz.',
    warmHospitality: 'Samimiy mehmondo‘stlik', hospitalityCopy: 'E’tiborli xizmat har bir mehmon o‘zini erkin his qiladigan muhit yaratadi.',
    yearsHospitality: 'Yillik mehmondo‘stlik', seasonalDishes: 'Mavsumiy taom', localPartners: 'Mahalliy hamkor', guestRating: 'Mehmonlar bahosi',
    aroundTable: 'Dasturxonimiz atrofida', glimpse: 'Savory muhiti', guestStory: 'Mehmon taassuroti',
    testimonial: '“Iliq muhit, o‘ziga xos taomlar va yana qaytishni istatadigan xizmat.”',
    tableWaiting: 'Stolingiz sizni kutmoqda', dineWithUs: 'Mehmonimiz bo‘ling',
    hoursCopy: 'Har kuni tushlik va kechki ovqat uchun ochiqmiz. Bandsiz ham kelishingiz mumkin, ammo kechqurun va dam olish kunlari stol band qilish tavsiya etiladi.',
    ourMenu: 'Menyumiz', menuIntro: 'Mavsumiy masalliqlar, mehr bilan tayyorlangan taomlar va baham ko‘rishga arzigulik ta’mlar.',
    all: 'Barchasi', starters: 'Yengil taomlar', mains: 'Asosiy taomlar', desserts: 'Shirinliklar', drinks: 'Ichimliklar', dishes: 'taom', addOrder: 'Buyurtmaga qo‘shish',
    footerCopy: 'Mazali taomlar, samimiy xizmat va unutilmas oqshomlar.', explore: 'Bo‘limlar', visit: 'Manzil',
    newsletter: 'Yangiliklar', email: 'Elektron pochta', subscribe: 'Obuna bo‘lish', privacy: 'Maxfiylik', terms: 'Shartlar',
    itemAdded: 'savatingizga qo‘shildi.',
    yourOrder: 'Buyurtmangiz', shoppingCart: 'Savatingiz', emptyCart: 'Savatingiz bo‘sh',
    emptyCartCopy: 'Mavsumiy menyuni ko‘rib, mazali taom tanlang.', browseMenu: 'Menyuni ko‘rish',
    orderSummary: 'Buyurtma tafsilotlari', continueCheckout: 'Rasmiylashtirishga o‘tish', removeItem: 'Mahsulotni o‘chirish',
    joinUs: 'Bizga qo‘shiling', details: 'Ma’lumotlaringiz', name: 'Ism', yourName: 'Ismingiz',
    phoneNumber: 'Telefon raqami', date: 'Sana', time: 'Vaqt', guests: 'Mehmonlar',
    requestReservation: 'Bron so‘rovini yuborish', reservationSuccess: 'Stol band qilish so‘rovi yuborildi.',
    finalStep: 'So‘nggi qadam', checkout: 'Buyurtmani rasmiylashtirish', deliveryAddress: 'Yetkazib berish manzili',
    addressPlaceholder: 'Ko‘cha, uy, xonadon', paymentMethod: 'To‘lov usuli',
    cashOnDelivery: 'Yetkazilganda to‘lash', card: 'Karta', placeOrder: 'Buyurtma berish',
    orderSuccess: 'Buyurtma qabul qilindi. Kuzatuv sahifasi ochilmoqda...', status: 'Yetkazib berish holati',
    trackOrder: 'Buyurtmani kuzatish', orderNumber: 'Buyurtma raqami', enterOrderNumber: 'Buyurtma raqamini kiriting',
    trackButton: 'Kuzatish', confirmed: 'Tasdiqlandi', preparing: 'Tayyorlanmoqda', onTheWay: 'Yo‘lda',
    contactDetails: 'Aloqa ma’lumotlari', orderContactTitle: 'Buyurtmani rasmiylashtirish uchun',
    emailLabel: 'Elektron pochta', continue: 'Davom etish', orderContact: 'BUYURTMA ALOQASI',
    notFound: 'Stol topilmadi', returnHome: 'Bosh sahifaga',
  },
}

export const locale = ref(localStorage.getItem('savory-locale') || 'en')
export const languages = [{ value: 'en', label: 'EN' }, { value: 'ru', label: 'RU' }, { value: 'uz', label: 'UZ' }]
export const theme = ref(localStorage.getItem('savory-theme') || 'light')

export function setTheme(value) {
  theme.value = value
  localStorage.setItem('savory-theme', value)
  document.documentElement.dataset.theme = value
}

export function setLocale(value) {
  if (!translations[value]) return
  locale.value = value
  localStorage.setItem('savory-locale', value)
  document.documentElement.lang = value
}

export function t(key) {
  return translations[locale.value]?.[key] || translations.en[key] || key
}

document.documentElement.lang = locale.value
document.documentElement.dataset.theme = theme.value
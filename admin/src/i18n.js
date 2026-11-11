import { ref } from 'vue'

const messages = {
  en: {
    dashboard: 'Dashboard', orders: 'Orders', menu: 'Menu', reservations: 'Reservations',
    customers: 'Customers', analytics: 'Analytics', hr: 'HR', settings: 'Settings',
    workspace: 'HR workspace', returnSite: '← Return to website', restaurant: 'HR · Restaurant',
    search: 'Search orders...', logout: 'Log out', openMenu: 'Open menu', closeMenu: 'Close menu',
    language: 'Language', dark: 'Dark mode', light: 'Light mode',
    loginWelcome: 'Welcome back', loginTitle: 'HR panel sign in', username: 'Username', password: 'Password',
    enterUsername: 'Enter username', enterPassword: 'Enter password', show: 'Show', hide: 'Hide', signIn: 'Sign in',
    invalidLogin: 'Incorrect credentials or the admin service is unavailable.',
    totalRevenue: 'Total revenue', avgOrder: 'Avg. order value', revenue: 'Revenue',
    last7: 'Last 7 days', last30: 'Last 30 days', popularDishes: 'Popular dishes', topItems: 'Top items',
    viewAll: 'View all', recentOrders: 'Recent orders', liveActivity: 'Live activity',
    order: 'Order', customer: 'Customer', items: 'Items', total: 'Total', status: 'Status',
    tonight: 'Tonight', manage: 'Manage', guests: 'guests',
    searchDishes: 'Search dishes...', addDish: '＋ Add dish', all: 'All', starters: 'Starters',
    mains: 'Mains', desserts: 'Desserts', drinks: 'Drinks', available: 'Available', hidden: 'Hidden',
    edit: 'Edit', delete: 'Delete', editDish: 'Edit dish', newDish: 'New dish', addMenuItem: 'Add menu item',
    name: 'Name', dishName: 'Dish name', description: 'Description', ingredients: 'Ingredients and preparation',
    price: 'Price ($)', category: 'Category', imageUrl: 'Image URL', cancel: 'Cancel', saveDish: 'Save dish',
    employeesAccess: 'Employees and access', employeeCount: 'employees', newEmployee: 'New employee',
    createAccount: 'Create account', fullName: 'Full name', login: 'Login', role: 'Role', addEmployee: 'Add employee',
    save: 'Save', remove: 'Remove', newPassword: 'New password', leaveBlank: 'Leave blank to keep current password',
    chef: 'Head chef', courier: 'Courier', admin: 'Admin', analyst: 'Analyst', creator: 'Creator',
    readOnlyEmployees: 'You can only view the employee list.',
    analystPermission: 'Analysts can edit and remove employees, but cannot add new ones.',
    loadingEmployees: 'Loading employees…', noEmployees: 'There are no employees yet.',
    errorLoadEmployees: 'Could not load employee list.', employeeAdded: 'Employee added.',
    confirmDelete: 'Delete employee', dishes: 'dishes',
    allActivity: 'All activity', dateTime: 'Date & time', type: 'Type', noEmail: 'No email',
    date: 'Date', today: 'Today', upcoming: 'Upcoming', pending: 'Pending', confirmed: 'Confirmed',
    new: 'New', seated: 'Seated', completed: 'Completed', cancelled: 'Cancelled', preparing: 'Preparing',
    ready: 'Ready', delivered: 'Delivered', searchOrdersCustomers: 'Search orders or customers...',
    searchCustomer: 'Search customer...', searchCustomers: 'Search customers...', lastVisit: 'Last visit',
    spent: 'Spent', grossRevenue: 'Gross revenue', totalOrders: 'Total orders',
    repeatCustomers: 'Repeat customers', thisWeek: 'this week', revenueOverview: 'Revenue overview',
    restaurantProfile: 'Restaurant profile', generalSettings: 'General settings',
    restaurantName: 'Restaurant name', phone: 'Phone', email: 'Email', address: 'Address',
    openingTime: 'Opening time', closingTime: 'Closing time', saveChanges: 'Save changes',
  },
  ru: {
    dashboard: 'Обзор', orders: 'Заказы', menu: 'Меню', reservations: 'Бронирования',
    customers: 'Клиенты', analytics: 'Аналитика', hr: 'Персонал', settings: 'Настройки',
    workspace: 'Рабочая панель', returnSite: '← Вернуться на сайт', restaurant: 'HR · Ресторан',
    search: 'Поиск заказов...', logout: 'Выйти', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню',
    language: 'Язык', dark: 'Тёмная тема', light: 'Светлая тема',
    loginWelcome: 'С возвращением', loginTitle: 'Вход в HR-панель', username: 'Логин', password: 'Пароль',
    enterUsername: 'Введите логин', enterPassword: 'Введите пароль', show: 'Показать', hide: 'Скрыть', signIn: 'Войти',
    invalidLogin: 'Неверные данные или HR-сервис недоступен.',
    totalRevenue: 'Общая выручка', avgOrder: 'Средний чек', revenue: 'Выручка',
    last7: 'Последние 7 дней', last30: 'Последние 30 дней', popularDishes: 'Популярные блюда', topItems: 'Лидеры продаж',
    viewAll: 'Все записи', recentOrders: 'Последние заказы', liveActivity: 'Активность',
    order: 'Заказ', customer: 'Клиент', items: 'Позиций', total: 'Сумма', status: 'Статус',
    tonight: 'Сегодня вечером', manage: 'Управлять', guests: 'гостей',
    searchDishes: 'Поиск блюд...', addDish: '＋ Добавить блюдо', all: 'Все', starters: 'Закуски',
    mains: 'Основные блюда', desserts: 'Десерты', drinks: 'Напитки', available: 'В меню', hidden: 'Скрыто',
    edit: 'Изменить', delete: 'Удалить', editDish: 'Изменить блюдо', newDish: 'Новое блюдо', addMenuItem: 'Добавить в меню',
    name: 'Название', dishName: 'Название блюда', description: 'Описание', ingredients: 'Состав и приготовление',
    price: 'Цена ($)', category: 'Категория', imageUrl: 'Ссылка на изображение', cancel: 'Отмена', saveDish: 'Сохранить блюдо',
    employeesAccess: 'Сотрудники и доступы', employeeCount: 'сотрудников', newEmployee: 'Новый сотрудник',
    createAccount: 'Создать учётную запись', fullName: 'Имя и фамилия', login: 'Логин', role: 'Роль', addEmployee: 'Добавить сотрудника',
    save: 'Сохранить', remove: 'Удалить', newPassword: 'Новый пароль', leaveBlank: 'Оставьте пустым, чтобы не менять пароль',
    chef: 'Главный шеф', courier: 'Курьер', admin: 'Админ', analyst: 'Аналитик', creator: 'Создатель',
    readOnlyEmployees: 'У вас есть доступ только для просмотра списка сотрудников.',
    analystPermission: 'Аналитик может изменять и удалять сотрудников, но не может добавлять новых.',
    loadingEmployees: 'Загружаем сотрудников…', noEmployees: 'Сотрудников пока нет.',
    errorLoadEmployees: 'Не удалось загрузить список сотрудников.', employeeAdded: 'Сотрудник добавлен.',
    confirmDelete: 'Удалить сотрудника', dishes: 'блюд',
    allActivity: 'Все события', dateTime: 'Дата и время', type: 'Тип', noEmail: 'Нет почты',
    date: 'Дата', today: 'Сегодня', upcoming: 'Предстоящие', pending: 'Ожидает',
    new: 'Новый', confirmed: 'Подтверждено', seated: 'Гости за столом', completed: 'Завершено',
    cancelled: 'Отменено', preparing: 'Готовится', ready: 'Готово', delivered: 'Доставлено',
    searchOrdersCustomers: 'Поиск заказов и клиентов...', searchCustomer: 'Поиск клиента...',
    searchCustomers: 'Поиск клиентов...', lastVisit: 'Последний визит', spent: 'Потрачено',
    grossRevenue: 'Валовая выручка', totalOrders: 'Всего заказов', repeatCustomers: 'Постоянные клиенты',
    thisWeek: 'за неделю', revenueOverview: 'Обзор выручки', restaurantProfile: 'Профиль ресторана',
    generalSettings: 'Общие настройки', restaurantName: 'Название ресторана', phone: 'Телефон',
    email: 'Электронная почта', address: 'Адрес', openingTime: 'Время открытия',
    closingTime: 'Время закрытия', saveChanges: 'Сохранить изменения',
  },
  uz: {
    dashboard: 'Boshqaruv', orders: 'Buyurtmalar', menu: 'Menyu', reservations: 'Bronlar',
    customers: 'Mijozlar', analytics: 'Tahlil', hr: 'Xodimlar', settings: 'Sozlamalar',
    workspace: 'Ish paneli', returnSite: '← Saytga qaytish', restaurant: 'HR · Restoran',
    search: 'Buyurtmalarni qidirish...', logout: 'Chiqish', openMenu: 'Menyuni ochish', closeMenu: 'Menyuni yopish',
    language: 'Til', dark: 'Qorong‘i rejim', light: 'Yorug‘ rejim',
    loginWelcome: 'Xush kelibsiz', loginTitle: 'HR paneliga kirish', username: 'Login', password: 'Parol',
    enterUsername: 'Loginni kiriting', enterPassword: 'Parolni kiriting', show: 'Ko‘rsatish', hide: 'Yashirish', signIn: 'Kirish',
    invalidLogin: 'Ma’lumotlar noto‘g‘ri yoki HR xizmati ishlamayapti.',
    totalRevenue: 'Umumiy daromad', avgOrder: 'O‘rtacha buyurtma', revenue: 'Daromad',
    last7: 'Oxirgi 7 kun', last30: 'Oxirgi 30 kun', popularDishes: 'Mashhur taomlar', topItems: 'Eng ko‘p sotilganlar',
    viewAll: 'Barchasini ko‘rish', recentOrders: 'So‘nggi buyurtmalar', liveActivity: 'Faollik',
    order: 'Buyurtma', customer: 'Mijoz', items: 'Taomlar', total: 'Jami', status: 'Holat',
    tonight: 'Bugun kechqurun', manage: 'Boshqarish', guests: 'mehmon',
    searchDishes: 'Taomlarni qidirish...', addDish: '＋ Taom qo‘shish', all: 'Barchasi', starters: 'Yengil taomlar',
    mains: 'Asosiy taomlar', desserts: 'Shirinliklar', drinks: 'Ichimliklar', available: 'Mavjud', hidden: 'Yashirilgan',
    edit: 'Tahrirlash', delete: 'O‘chirish', editDish: 'Taomni tahrirlash', newDish: 'Yangi taom', addMenuItem: 'Menyuga qo‘shish',
    name: 'Nomi', dishName: 'Taom nomi', description: 'Tavsif', ingredients: 'Masalliqlar va tayyorlanishi',
    price: 'Narxi ($)', category: 'Turkum', imageUrl: 'Rasm havolasi', cancel: 'Bekor qilish', saveDish: 'Taomni saqlash',
    employeesAccess: 'Xodimlar va ruxsatlar', employeeCount: 'xodim', newEmployee: 'Yangi xodim',
    createAccount: 'Hisob yaratish', fullName: 'Ism-familiya', login: 'Login', role: 'Vazifa', addEmployee: 'Xodim qo‘shish',
    save: 'Saqlash', remove: 'O‘chirish', newPassword: 'Yangi parol', leaveBlank: 'Parolni o‘zgartirmaslik uchun bo‘sh qoldiring',
    chef: 'Bosh oshpaz', courier: 'Yetkazuvchi', admin: 'Administrator', analyst: 'Tahlilchi', creator: 'Yaratuvchi',
    readOnlyEmployees: 'Xodimlar ro‘yxatini faqat ko‘rishingiz mumkin.',
    analystPermission: 'Tahlilchi xodimlarni o‘zgartirishi va o‘chirishi mumkin, ammo yangisini qo‘sha olmaydi.',
    loadingEmployees: 'Xodimlar yuklanmoqda…', noEmployees: 'Hozircha xodimlar yo‘q.',
    errorLoadEmployees: 'Xodimlar ro‘yxatini yuklab bo‘lmadi.', employeeAdded: 'Xodim qo‘shildi.',
    confirmDelete: 'Xodimni o‘chirish', dishes: 'taom',
    allActivity: 'Barcha faollik', dateTime: 'Sana va vaqt', type: 'Turi', noEmail: 'Email yo‘q',
    date: 'Sana', today: 'Bugun', upcoming: 'Kelayotgan', pending: 'Kutilmoqda',
    new: 'Yangi', confirmed: 'Tasdiqlangan', seated: 'Mehmonlar joylashdi', completed: 'Yakunlandi',
    cancelled: 'Bekor qilindi', preparing: 'Tayyorlanmoqda', ready: 'Tayyor', delivered: 'Yetkazildi',
    searchOrdersCustomers: 'Buyurtma va mijozlarni qidirish...', searchCustomer: 'Mijozni qidirish...',
    searchCustomers: 'Mijozlarni qidirish...', lastVisit: 'So‘nggi tashrif', spent: 'Sarflangan',
    grossRevenue: 'Umumiy daromad', totalOrders: 'Jami buyurtmalar', repeatCustomers: 'Doimiy mijozlar',
    thisWeek: 'bu hafta', revenueOverview: 'Daromad ko‘rinishi', restaurantProfile: 'Restoran profili',
    generalSettings: 'Umumiy sozlamalar', restaurantName: 'Restoran nomi', phone: 'Telefon',
    email: 'Elektron pochta', address: 'Manzil', openingTime: 'Ochilish vaqti',
    closingTime: 'Yopilish vaqti', saveChanges: 'O‘zgarishlarni saqlash',
  },
}

export const locale = ref(localStorage.getItem('savory-admin-locale') || 'ru')
export const theme = ref(localStorage.getItem('savory-admin-theme') || 'light')
export const languages = [{ value: 'ru', label: 'RU' }, { value: 'en', label: 'EN' }, { value: 'uz', label: 'UZ' }]

export function setLocale(value) {
  if (!messages[value]) return
  locale.value = value
  localStorage.setItem('savory-admin-locale', value)
  document.documentElement.lang = value
}

export function setTheme(value) {
  theme.value = value
  localStorage.setItem('savory-admin-theme', value)
  document.documentElement.dataset.theme = value
}

export function t(key) {
  return messages[locale.value]?.[key] || messages.en[key] || key
}

document.documentElement.lang = locale.value
document.documentElement.dataset.theme = theme.value

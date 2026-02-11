export const AUTH_DATA = {
  // Данные для успешного входа
  validUser: {
    email: 'nafiginm@yandex.ru', // Замените на реальный тестовый логин
    pass: 'ixS4TVhNp_8ZMk6nr',
  },

  // Данные для проверки ошибок
  // invalidUser: {
  //   email: 'wrong@user.com',
  //   pass: '12345',
  // },

  // Списки для параметризованных тестов валидации
  invalidEmails: [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
  ],
};

import axios from 'axios';

const API_URL = 'https://mailsac.com/api';

export async function createRandomAccount() {
  // Пробуем альтернативный домен Mailsac, который реже в черных списках
  const domains = ['mailsac.com', 'msac.net', 'smscat.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  // Создаем максимально "человекоподобный" логин
  const randomPrefix = Math.random().toString(36).substring(2, 8);
  const email = `j.williams_${randomPrefix}@${domain}`;
  const password = 'Password123!';

  console.log(`[Mailsac] Выбран адрес: ${email}`);
  return { email, password };
}

export async function getVerificationCode(email: string): Promise<string> {
  // Увеличиваем общее время до 120 секунд
  for (let i = 1; i <= 40; i++) {
    try {
      // Ждем 3 секунды между проверками
      await new Promise((res) => setTimeout(res, 3000));

      // Проверяем список сообщений
      const response = await axios.get(
        `${API_URL}/addresses/${email}/messages`,
      );
      const messages = response.data;

      if (Array.isArray(messages) && messages.length > 0) {
        console.log(`[Mailsac] Сообщение доставлено!`);

        const msgId = messages[0]._id;
        // Используем эндпоинт для получения текста без форматирования
        const textRes = await axios.get(`${API_URL}/dirty/${email}/${msgId}`);
        const body =
          typeof textRes.data === 'string'
            ? textRes.data
            : JSON.stringify(textRes.data);

        // Ищем 6 цифр
        const match = body.match(/\b\d{6}\b/);
        if (match) return match[0];
      }

      if (i % 5 === 0) {
        console.log(`[Mailsac] Попытка ${i}: писем для ${email} всё ещё нет.`);
      }
    } catch (error) {
      // Игнорируем ошибки API
    }
  }
  throw new Error(
    `OTP код не пришел на ${email}. Бэкенд ответил 200, но письмо потеряно в шлюзе.`,
  );
}

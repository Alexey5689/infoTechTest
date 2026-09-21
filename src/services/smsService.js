const SMSPILOT_API_URL = 'https://smspilot.ru/api.php';
const SMSPILOT_API_KEY = import.meta.env.VITE_SMS_PILOT_API_KEY || 'emulator'; // 'emulator' — тестовый ключ, без отправки

/**
 * Отправляет SMS уведомление (имитация)
 * @param {string} phone - номер телефона получателя
 * @param {string} message - текст сообщения
 * @returns {Promise<object>} - имитация ответа API
 */
export const sendSmsNotification = async (phone, message) => {
    const requestParams = {
        send: `${phone}:${message}`,
        apikey: SMSPILOT_API_KEY,
        format: 'json',
    };

    console.log('  [SMS Pilot] Исходящий запрос (эмуляция):');
    console.log('   URL:', SMSPILOT_API_URL);
    console.log('   Параметры:', requestParams);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockResponse = {
        send: [
            {
                server_id: Math.floor(Math.random() * 1000000),
                phone: phone,
                price: 0,
                status: 'accepted (emulator mode)',
            },
        ],
        balance: 100.0,
    };

    console.log('   Ответ (эмулятор):', mockResponse);

    return {
        success: true,
        data: mockResponse,
    };
};

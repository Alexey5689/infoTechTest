// Ошибка API в формате book.yaml: { success: false, errors: [{ field, message }] }.
export class ApiError extends Error {
    constructor(status, errors) {
        super(errors[0]?.message || 'Ошибка запроса');
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

export const notFound = (entity) => new ApiError(404, [{ field: 'id', message: `${entity} не найден(а)` }]);

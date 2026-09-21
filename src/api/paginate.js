export const paginate = (rows, page, perPage) => {
    const currentPage = page || 1;
    const size = perPage || 20;
    const total = rows.length;
    const start = (currentPage - 1) * size;

    return {
        items: rows.slice(start, start + size),
        pagination: {
            total,
            page: currentPage,
            per_page: size,
            total_pages: Math.max(1, Math.ceil(total / size)),
        },
    };
};

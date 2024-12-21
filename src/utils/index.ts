export const formatResponse = <T>(
  data: T,
  status: "success" | "error" = "success"
) => {
  return {
    header: { status },
    body: { data },
  };
};

export const getPagination = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const getPagingData = <T>(
  data: { count: number; rows: T[] },
  page: number,
  limit: number
) => {
  const { count: total, rows } = data;
  const currentPage = page;
  const totalPages = Math.ceil(total / limit);

  return { total, data: rows, currentPage, totalPages };
};

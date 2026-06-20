export function normalizePaginatedResponse(data) {
  if (!data) {
    return {
      page: 1,
      totalPages: 1,
      totalResults: 0,
      result: [],
    };
  }

  // Handle Backend response format: { data: [...], page, limit, totalPages, totalResults }
  if (Array.isArray(data.data)) {
    return {
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 1,
      totalResults: data.totalResults || 0,
      result: data.data,
    };
  }

  if (Array.isArray(data.result)) {
    return data;
  }

  if (Array.isArray(data.results)) {
    return {
      ...data,
      result: data.results,
    };
  }

  // Handle array responses
  if (Array.isArray(data)) {
    return {
      page: 1,
      totalPages: 1,
      totalResults: data.length,
      result: data,
    };
  }

  return {
    page: data.page || 1,
    totalPages: data.totalPages || 1,
    totalResults: data.totalResults || 0,
    result: [],
  };
}


export function normalizeError(error, fallbackMessage = "An error occurred") {
    const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

    return new Error(apiMessage || fallbackMessage);
}
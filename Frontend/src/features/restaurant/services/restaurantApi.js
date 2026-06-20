import api from "../../../services/api";
import { normalizePaginatedResponse, normalizeError } from "../../../services/normalize";



function isFormDataPayload(payload) {
  return typeof FormData !== "undefined" && payload instanceof FormData;
}

export async function getProducts(params = {}) {
  try {
    const response = await api.get("/products", { params });
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    throw normalizeError(error, "Failed to fetch products");
  }
}

export async function getProductById(productId) {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to fetch product");
  }
}

export async function createProduct(payload) {
  try {
    const config = isFormDataPayload(payload)
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    const response = await api.post("/products", payload, config);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to create product");
  }
}

export async function updateProduct(productId, payload) {
  try {
    const config = isFormDataPayload(payload)
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    const response = await api.put(`/products/${productId}`, payload, config);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to update product");
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to delete product");
  }
}

export async function getOrders(params = {}) {
  try {
    const response = await api.get("/orders", { params });
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    throw normalizeError(error, "Failed to fetch orders");
  }
}

export async function createOrder(payload) {
  try {
    const response = await api.post("/orders", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to create order");
  }
}

export async function updateOrder(orderId, payload) {
  try {
    const response = await api.put(`/orders/${orderId}`, payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to update order");
  }
}

export async function getstatistics() {
  try {
    const response = await api.get("/orders/stats");
    return response.data;
  }catch (error) {
    throw normalizeError(error, "Failed to fetch statistics");
     }
  }


export async function getReviews(params = {}) {
  try {
    const response = await api.get("/reviews", { params });
        return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to fetch reviews");
  }
}

export async function createReview(payload) {
  try {
    const response = await api.post("/reviews", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to create review");
  }
}

export async function updateReview(reviewId, payload) {
  try {
    const response = await api.put(`/reviews/${reviewId}`, payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to update review");
  }
}

export async function deleteReview(reviewId) {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to delete review");
  }
}

export async function getCategories(params = {}) {
  try {
    const response = await api.get("/categories", { params });
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    throw normalizeError(error, "Failed to fetch categories");
  }
}

export async function createCategory(payload) {
  try {
    const response = await api.post("/categories", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to create category");
  }
}

export async function deleteCategory(categoryId) {
  try{
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
     throw normalizeError(error, "Failed to delete category");
  }
}

export async function getBrands(params = {}) {
  try {
    const response = await api.get("/brands", { params });
    return normalizePaginatedResponse(response.data);
  } catch (error) {
    throw normalizeError(error, "Failed to fetch brands");
  }
}

export async function createBrand(payload) {
  try {
    const response = await api.post("/brands", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Failed to create brand");
  }
}

export async function deleteBrand(brandId) {
  try{
    const response = await api.delete(`/brands/${brandId}`);
    return response.data;
  } catch (error) {
     throw normalizeError(error, "Failed to delete brand");
  }
}

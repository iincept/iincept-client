import axiosClient from './axiosClient';

export const createOrder = async (orderData) => {
  const response = await axiosClient.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosClient.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await axiosClient.put(`/orders/${id}/cancel`);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axiosClient.post('/orders/verify', paymentData);
  return response.data;
};

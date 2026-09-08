import axiosClient from './axiosClient';

export const getWishlist = async () => {
  const response = await axiosClient.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axiosClient.post('/wishlist', { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axiosClient.delete(`/wishlist/${productId}`);
  return response.data;
};

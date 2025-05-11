import { useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../config';
import { useAppStore } from '../store';
import { MenusResponse } from '../types/menu';

const fetchMenus = async (): Promise<MenusResponse> => {
  console.log('useMenuData - Starting fetch, URL:', API_URL);
  try {
    console.log('useMenuData - Attempting fetch...');
    const { data } = await axios.get(API_URL);
    console.log('useMenuData - API Data:', data);
    if (!data.success) throw new Error('Failed to fetch menus');
    return data;
  } catch (error) {
    console.error('useMenuData - Fetch Error:', error.message);
    console.error('useMenuData - Error Details:', error.response || error);
    throw error;
  }
};
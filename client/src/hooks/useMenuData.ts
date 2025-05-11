import { useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../config';

console.log('useMenuData - Hook Loaded');

const fetchMenus = async () => {
  console.log('useMenuData - Starting fetch, URL:', API_URL);
  try {
    const response = await fetch(API_URL);
    console.log('useMenuData - Fetch Response:', response);
    const data = await response.json();
    console.log('useMenuData - API Data:', data);
    return data;
  } catch (error) {
    console.error('useMenuData - Fetch Error:', error.message);
    throw error;
  }
};
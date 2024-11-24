'use client';

import { postAPI } from '@/app/api/entrypoint';

export const loginService = async (credentials) => {
  try {
    const response = await postAPI('meta_data_mgt/userManager/login_user', {
      user_name: credentials.user_name,
      user_password: credentials.user_password
    });

    if ('data' in response && response.data.status === 'success') {
      // 將使用者資料存入 localStorage 或 sessionStorage
      localStorage.setItem('userData', JSON.stringify(response.data.data));
      return {
        status: 'success',
        data: response.data.data
      };
    } else {
      return {
        status: 'error',
        message: '登入失敗，請檢查帳號密碼'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: '系統錯誤，請稍後再試'
    };
  }
};

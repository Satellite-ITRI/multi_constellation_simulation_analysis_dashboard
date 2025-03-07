// app/signup/service.js
'use client';

import { postAPI } from '@/app/api/entrypoint';

export const signupService = async (userData) => {
  try {
    const response = await postAPI('meta_data_mgt/userManager/create_user', {
      user_name: userData.user_name,
      user_password: userData.user_password,
      user_email: userData.user_email
    });

    if (response.data.status === 'success') {
      return {
        status: 'success',
        data: response.data
      };
    } else {
      return {
        status: 'error',
        message: '註冊失敗，請稍後再試'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: '系統錯誤，請稍後再試'
    };
  }
};

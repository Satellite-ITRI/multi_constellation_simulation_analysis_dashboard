'use client';

import React from 'react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
  ToastProvider
} from '@/components/ui/toast';

type CustomToastProps = {
  type: 'error' | 'success';
  message: string;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
};

const CustomToast: React.FC<CustomToastProps> = ({
  type,
  message,
  showToast,
  setShowToast
}) => {
  // 根據不同的類型設置不同的樣式和標題
  const variant = type === 'error' ? 'destructive' : 'default';
  const title = type === 'error' ? 'Error' : 'Success';

  return (
    <>
      <ToastViewport />
      <Toast open={showToast} onOpenChange={setShowToast} variant={variant}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{message}</ToastDescription>
        <ToastClose />
      </Toast>
    </>
  );
};

export default CustomToast;

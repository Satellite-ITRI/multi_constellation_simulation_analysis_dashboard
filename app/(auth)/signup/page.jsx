'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerService } from './service';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
    user_email: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await registerService(formData);
    if (result.status === 'success') {
      router.push('/auth/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <h2 className="text-center text-2xl font-bold">註冊</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="user_name"
              type="text"
              placeholder="使用者名稱"
              value={formData.user_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Input
              name="user_email"
              type="email"
              placeholder="電子郵件"
              value={formData.user_email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Input
              name="user_password"
              type="password"
              placeholder="密碼"
              value={formData.user_password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full">
            註冊
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={() => router.push('/auth/login')}>
            已有帳號？立即登入
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { signupService } from './service';

export default function SignupPage() {
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

    // 基本驗證
    if (!formData.user_email.includes('@')) {
      setError('請輸入有效的電子郵件地址');
      return;
    }

    if (formData.user_password.length < 8) {
      setError('密碼長度至少需要8個字元');
      return;
    }

    const result = await signupService(formData);
    if (result.status === 'success') {
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="mx-4 w-1/2 max-w-sm">
        <CardHeader>
          <h2 className="text-center text-2xl font-semibold">註冊帳號</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="user_name"
                type="text"
                placeholder="使用者名稱"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                name="user_email"
                type="email"
                placeholder="電子郵件"
                value={formData.user_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
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
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push('/')}>
            已有帳號？立即登入
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

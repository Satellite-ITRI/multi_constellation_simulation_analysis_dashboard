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
import { loginService } from './service';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: ''
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

    const result = await loginService(formData);
    if (result.status === 'success') {
      router.push('/constellation_simulation');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="mx-auto w-1/2 max-w-sm">
        <CardHeader>
          <h2 className="text-center text-2xl font-semibold">登入</h2>
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
              登入
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push('/signup')}>
            還沒有帳號？立即註冊
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

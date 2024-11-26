'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard : Overview'
};

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">選擇類別</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="constellation_simulation/handover">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Handover</CardTitle>
              <CardDescription>處理交接相關事項</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="constellation_simulation/isl">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>ISL</CardTitle>
              <CardDescription>管理 ISL 相關設定</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="constellation_simulation/routing">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Routing</CardTitle>
              <CardDescription>路由設定與管理</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

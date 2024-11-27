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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link href="constellation_simulation/constellation/coverage_analysis">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Constellation</CardTitle>
              <CardDescription>Simulation</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="constellation_simulation/isl/energy_saving_connection_isl_disconnection">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>ISL</CardTitle>
              <CardDescription>Simulation</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="constellation_simulation/routing/point_multipoint_transmission">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Routing</CardTitle>
              <CardDescription>Simulation</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="constellation_simulation/handover/multibeam">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Handover</CardTitle>
              <CardDescription>Simulation</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

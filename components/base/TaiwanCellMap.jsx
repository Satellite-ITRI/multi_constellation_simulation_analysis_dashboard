'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// 動態導入 react-leaflet 組件
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export function TaiwanCellMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taiwan Cell Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '300px', width: '100%' }}>
          <MapContainer
            center={[23.5, 121]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}

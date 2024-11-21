import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const ApplicationCard = ({ id, data }) => {
  const router = useRouter();

  const getStatusBadge = (status) => {
    const statusStyles = {
      'In Progress': 'bg-blue-500 text-black',
      Failed: 'bg-red-500 text-black',
      Done: 'bg-green-500 text-black'
    };

    return <Badge className={`${statusStyles[status]} ml-2`}>{status}</Badge>;
  };

  const handleDetailsClick = () => {
    router.push(`/dashboard/overview/result/${id}`);
  };

  return (
    <div className="relative flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <div className="flex-1">
        <div className="flex items-center">
          <h2 className="p-1 text-xl font-semibold">Handover {id}</h2>
          {getStatusBadge(data.status || 'In Progress')}
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-gray-500">Strategy: {data.strategy}</p>
          <p className="text-gray-500">Timing: {data.timing}</p>
          <p className="text-gray-500">Fleet: {data.fleet}</p>
        </div>
      </div>
      {data.status === 'Done' && (
        <div className="ml-4">
          <button
            onClick={handleDetailsClick}
            className="transform rounded-lg border border-black bg-stone-200 px-4 py-2 font-bold text-black transition-all hover:scale-105 hover:bg-stone-300"
          >
            Result
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;

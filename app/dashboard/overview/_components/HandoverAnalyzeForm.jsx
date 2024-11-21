'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dela_Gothic_One } from 'next/font/google';

const strategies = [
  'MaxVisibleTime',
  'MinRange',
  'MinAvrRange',
  'MaxElevation',
  'MaxSNR',
  'MaxPredictedAvgSNR'
];

const timings = ['Preemptive', 'Nonpreemptive'];

const fleets = [
  'TLE_3P_22Sats_29deg_F1',
  'TLE_6P_22Sats_29deg_F1',
  'TLE_12P_22Sats_29deg_F7'
];

const HandoverAnalyzeForm = ({ onClose }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('');

  const handleSubmit = () => {
    // 處理表單提交
    console.log({
      strategy: selectedStrategy,
      timing: selectedTiming,
      fleet: selectedFleet
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Create Handover Analysis</CardTitle>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strategy Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
            <SelectTrigger>
              <SelectValue placeholder="Select a strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timing Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Timing</label>
          <Select value={selectedTiming} onValueChange={setSelectedTiming}>
            <SelectTrigger>
              <SelectValue placeholder="Select timing" />
            </SelectTrigger>
            <SelectContent>
              {timings.map((timing) => (
                <SelectItem key={timing} value={timing}>
                  {timing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fleet Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fleet</label>
          <Select value={selectedFleet} onValueChange={setSelectedFleet}>
            <SelectTrigger>
              <SelectValue placeholder="Select a fleet" />
            </SelectTrigger>
            <SelectContent>
              {fleets.map((fleet) => (
                <SelectItem key={fleet} value={fleet}>
                  {fleet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          className="mt-6 w-full"
          onClick={handleSubmit}
          disabled={!selectedStrategy || !selectedTiming || !selectedFleet}
        >
          Create Analysis
        </Button>
      </CardContent>
    </Card>
  );
};
export default HandoverAnalyzeForm;

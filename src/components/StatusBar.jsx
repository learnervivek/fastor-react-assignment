import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const StatusBar = ({ dark = false, className = '' }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-20 ${
        dark ? 'text-white' : 'text-gray-900'
      } ${className}`}
    >
      <span className="font-semibold tracking-tight">{time}</span>
      <div className="flex items-center space-x-1.5">
        {/* Cellular Signal Bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <span className="w-0.5 h-1 bg-current rounded-full"></span>
          <span className="w-0.5 h-1.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-2 bg-current rounded-full"></span>
          <span className="w-0.5 h-2.5 bg-current rounded-full"></span>
        </div>

        {/* Wifi Icon */}
        <Wifi className="w-3.5 h-3.5" />

        {/* Battery Icon with Cap */}
        <div className="flex items-center">
          <div className="w-5 h-2.5 border border-current rounded-[3px] p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-current rounded-[1px]"></div>
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-xs ml-px"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

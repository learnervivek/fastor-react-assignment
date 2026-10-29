import React from 'react';
import { Delete } from 'lucide-react';
import HomeIndicator from './HomeIndicator';

const keys = [
  { num: '1', letters: '' },
  { num: '2', letters: 'ABC' },
  { num: '3', letters: 'DEF' },
  { num: '4', letters: 'GHI' },
  { num: '5', letters: 'JKL' },
  { num: '6', letters: 'MNO' },
  { num: '7', letters: 'PQRS' },
  { num: '8', letters: 'TUV' },
  { num: '9', letters: 'WXYZ' },
  { num: '', letters: '' },
  { num: '0', letters: '' },
  { num: 'del', letters: '' },
];

export const NumericKeypad = ({ onKeyPress, onDelete }) => {
  return (
    <div className="bg-[#CFD3D9] pt-2 px-1.5 pb-1 select-none border-t border-gray-300">
      <div className="grid grid-cols-3 gap-1.5 max-w-sm mx-auto">
        {keys.map((k, idx) => {
          if (k.num === '') {
            return <div key={idx} className="h-12" />;
          }

          if (k.num === 'del') {
            return (
              <button
                key={idx}
                type="button"
                onClick={onDelete}
                className="h-12 flex items-center justify-center rounded-lg text-gray-800 active:bg-gray-400/40 transition-colors"
                aria-label="Delete last digit"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Delete className="w-6 h-6 stroke-[1.8]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onKeyPress(k.num)}
              className="keypad-btn h-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-keypad border-b border-gray-300 active:bg-gray-200 transition-all"
            >
              <span className="text-[22px] font-medium text-gray-900 leading-none">{k.num}</span>
              {k.letters ? (
                <span className="text-[9px] font-bold text-gray-500 tracking-wider mt-0.5">
                  {k.letters}
                </span>
              ) : (
                <span className="h-2.5" />
              )}
            </button>
          );
        })}
      </div>
      <HomeIndicator className="pt-2 pb-1" />
    </div>
  );
};

export default NumericKeypad;

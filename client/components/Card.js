import React from 'react';

export default function Card({ title, amount, unit, pm, icon }) {
  return (
    <div className='flex items-center justify-between p-6 w-80 rounded-lg border border-gray-200 bg-white'>
      <div>
        <p className='font-medium text-sm text-gray-600'>{title}</p>
        <p className='font-semibold text-2xl'>
          {`${amount} ${unit ? unit : ''}`}
          {pm && <span className='text-base'>/month</span>}
        </p>
      </div>
      <div className='p-2 rounded-full bg-green-500'>{icon}</div>
    </div>
  );
}

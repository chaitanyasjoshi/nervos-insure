import React, { useState } from 'react';
import { ExclamationCircleIcon, XIcon } from '@heroicons/react/outline';

export default function Banner() {
  const [closed, setClosed] = useState(false);

  return (
    <div className={`${closed ? 'hidden' : ''} mt-3 bg-indigo-600 rounded-md`}>
      <div className='max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='w-0 flex-1 flex items-center'>
            <ExclamationCircleIcon
              className='h-6 w-6 text-white'
              aria-hidden='true'
            />
            <p className='ml-3 font-normal text-white truncate'>
              <span className='md:hidden'>No account connected!</span>
              <span className='hidden md:inline'>
                No account connected! Please connect your account through
                metamask to use this app.
              </span>
            </p>
          </div>
          <div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>
            <button
              type='button'
              onClick={() => setClosed(true)}
              className='-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'
            >
              <span className='sr-only'>Dismiss</span>
              <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ExclamationIcon, XIcon } from '@heroicons/react/outline';

export default function Banner({ msgShort, msgLong, link }) {
  const [closed, setClosed] = useState(false);

  return (
    <div className={`${closed && 'hidden'} mb-3 bg-yellow-100 rounded-md`}>
      <div className='max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='w-0 flex-1 flex items-center'>
            <ExclamationIcon
              className='h-5 w-5 text-yellow-500'
              aria-hidden='true'
            />
            <p className='ml-3 text-sm font-medium text-gray-800 truncate'>
              <span className='md:hidden'>{msgShort}</span>
              <span className='hidden md:inline'>
                {msgLong}
                {link ? (
                  <a
                    className='underline'
                    href='https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/component-tutorials/4.layer2.deposit.md'
                  >
                    here.
                  </a>
                ) : (
                  ''
                )}
              </span>
            </p>
          </div>
          <div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>
            <button
              type='button'
              onClick={() => setClosed(true)}
              className='-mr-1 flex p-2 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'
            >
              <span className='sr-only'>Dismiss</span>
              <XIcon className='h-5 w-5 text-yellow-500' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

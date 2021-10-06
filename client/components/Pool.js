import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { toCkb } from '../utils/utils';
import { getReserveAvailableLiquidity } from '../web3/capitalpool';

export default function Pool({ asset, type, supplyCapital, withdrawCapital }) {
  const [tab, setTab] = useState(1);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [poolSupply, setPoolSupply] = useState(0);

  useEffect(() => {
    fetchData();
    window.ethereum.on('accountsChanged', fetchData);
  }, []);

  async function fetchData() {
    if (window.ethereum.selectedAddress) {
      setPoolSupply(toCkb(await getReserveAvailableLiquidity()).toFixed(4));
    }
  }

  return (
    <div className='p-6 w-96 rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center mb-6'>
        <div className='pr-6'>
          <Image src={`/${asset}.png`} alt={asset} width='24' height='36' />
        </div>
        <div>
          <p className='font-bold'>{asset}</p>
          <p className='text-sm font-light text-gray-500'>{type}</p>
        </div>
        <div className='ml-auto'>
          <p className='text-sm font-light text-gray-500'>Supplied Capital</p>
          <p className='text-sm'>{poolSupply} CKB</p>
        </div>
      </div>
      <header className='flex justify-between'>
        <p
          onClick={() => setTab(1)}
          className={`pb-2 w-1/2 font-light text-center cursor-pointer ${
            tab === 1
              ? 'border-b-2 border-indigo-500'
              : 'border-b border-gray-200'
          } transition-colors duration-300 ease-in`}
        >
          Supply
        </p>
        <p
          onClick={() => setTab(2)}
          className={`pb-2 w-1/2 font-light text-center cursor-pointer ${
            tab === 2
              ? 'border-b-2 border-indigo-500'
              : 'border-b border-gray-200'
          } transition-colors duration-300 ease-in`}
        >
          Withdraw
        </p>
      </header>
      {tab === 1 ? (
        <div className='w-full mt-6'>
          <div className='z-0 w-full inline-flex rounded-md shadow-sm -space-x-px'>
            <input
              type='number'
              value={supplyAmount}
              onChange={(event) => setSupplyAmount(event.target.value)}
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 w-full px-4 py-2 border text-sm font-medium rounded-l-md'
            />
            <input
              type='text'
              value='CKB'
              disabled
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 focus:z-10 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600 w-16 px-4 py-2 border text-sm font-extrabold rounded-r-md'
            />
          </div>
          <button
            className='py-2 mt-6 w-full text-white bg-indigo-600 rounded-md'
            onClick={() => supplyCapital(supplyAmount)}
          >
            Supply Capital
          </button>
        </div>
      ) : (
        <div className='w-full mt-6'>
          <div className='z-0 w-full inline-flex rounded-md shadow-sm -space-x-px'>
            <input
              type='number'
              value={withdrawAmount}
              onChange={(event) => setWithdrawAmount(event.target.value)}
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 w-full px-4 py-2 border text-sm font-medium rounded-l-md'
            />
            <input
              type='text'
              value='CKB'
              disabled
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 focus:z-10 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600 w-16 px-4 py-2 border text-sm font-extrabold rounded-r-md'
            />
          </div>
          <button
            className='py-2 mt-6 w-full text-white bg-indigo-600 rounded-md'
            onClick={() => withdrawCapital(withdrawAmount)}
          >
            Withdraw Capital
          </button>
        </div>
      )}
    </div>
  );
}

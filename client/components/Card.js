import React from 'react';
import Image from 'next/image';
import { newContract } from '../web3/insuranceprovider';

export default function Card({ asset, type, premium }) {
  return (
    <div
      className='p-6 w-96 mb-6 rounded-lg border border-gray-200 bg-white'
      onClick={async () => {
        await newContract(window.ethereum.selectedAddress, 1800, 100, 1000);
      }}
    >
      <div className='flex items-center pb-6'>
        <div className='pr-6'>
          <Image src={`/${asset}.png`} alt={asset} width='24' height='36' />
        </div>
        <div>
          <p className='font-bold'>{asset}</p>
          <p className='text-sm font-light text-gray-500'>{type}</p>
        </div>
        <div className='ml-auto'>
          <p className='text-sm font-light text-gray-500'>Premium</p>
          <p className='text-sm'>{premium}%/year</p>
        </div>
      </div>
      <button className='py-2 w-full text-white bg-indigo-600 rounded-md'>
        Buy
      </button>
    </div>
  );
}

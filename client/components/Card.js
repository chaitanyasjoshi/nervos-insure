import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

import { newContract } from '../web3/insuranceprovider';
import { fromCkb } from '../utils/utils';

export default function Card({ asset, type, premiumPct }) {
  const [duration, setDuration] = useState(30);
  const [cover, setCover] = useState(0);
  const [premium, setPremium] = useState(0);

  const DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production

  const calculatePremium = function (duration, cover) {
    const premiumPercentage = (premiumPct / 12) * (duration / 30);
    setPremium(cover * (premiumPercentage / 100));
  };

  const decrementDuration = function () {
    if (duration - 30 > 0) {
      calculatePremium(duration - 30, cover);
      setDuration(duration - 30);
    }
  };

  const incrementDuration = function () {
    calculatePremium(duration + 30, cover);
    setDuration(duration + 30);
  };

  const buyCover = async function () {
    if (cover > 0) {
      await newContract(
        window.ethereum.selectedAddress,
        duration * DAY_IN_SECONDS,
        fromCkb(premium),
        fromCkb(cover)
      );
    }
  };

  const changeCover = function (event) {
    setCover(event.target.value);
    calculatePremium(duration, event.target.value);
  };

  return (
    <div className='p-6 w-96 mb-6 rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center mb-3'>
        <div className='pr-6'>
          <Image src={`/${asset}.png`} alt={asset} width='24' height='36' />
        </div>
        <div>
          <p className='font-bold'>{asset}</p>
          <p className='text-sm font-light text-gray-500'>{type}</p>
        </div>
        <div className='ml-auto'>
          <p className='text-sm font-light text-gray-500'>Premium</p>
          <p className='text-sm'>{premiumPct}%/year</p>
        </div>
      </div>
      <div className='flex flex-col mb-3'>
        <label className='text-sm font-light text-gray-500'>Cover</label>
        <div className='z-0 inline-flex rounded-md shadow-sm -space-x-px'>
          <input
            type='number'
            value={cover}
            onChange={(event) => changeCover(event)}
            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 w-full px-4 py-2 border text-sm font-medium rounded-l-md'
          />
          <input
            type='text'
            value='CKB'
            disabled
            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 focus:z-10 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600 w-16 px-4 py-2 border text-sm font-extrabold rounded-r-md'
          />
        </div>
      </div>
      <div className='flex justify-between mb-6'>
        <div className='flex flex-col'>
          <label className='text-sm font-light text-gray-500'>Duration</label>
          <div className='z-0 inline-flex rounded-md shadow-sm -space-x-px'>
            <button
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 focus:z-10 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600 px-4 py-2 border text-sm font-extrabold rounded-l-md'
              onClick={decrementDuration}
            >
              -
            </button>
            <input
              type='number'
              value={duration}
              disabled
              className='text-center bg-white border-gray-300 text-gray-500 hover:bg-gray-50 w-16 px-4 py-2 border text-sm font-medium'
            />
            <button
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 focus:z-10 focus:bg-indigo-50 focus:border-indigo-500 focus:text-indigo-600 px-4 py-2 border text-sm font-extrabold rounded-r-md'
              onClick={incrementDuration}
            >
              +
            </button>
          </div>
        </div>
        <div className='flex flex-col'>
          <p className='text-sm font-light text-gray-500'>Calculated Premium</p>
          <p className='my-auto'>{premium.toFixed(4)} CKB</p>
        </div>
      </div>

      <button
        className='py-2 w-full text-white bg-indigo-600 rounded-md'
        onClick={buyCover}
      >
        Buy
      </button>
    </div>
  );
}

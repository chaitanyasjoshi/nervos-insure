import React from 'react';
import Head from 'next/head';

import Stat from '../components/Stat';
import {
  ChartPieIcon,
  LibraryIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import { balanceOf } from '../web3/capitalpool';
import { toCkb } from '../utils/utils';
import Pool from '../components/Pool';

export default function capital() {
  const [suppliedCapital, setsuppliedCapital] = useState(0);
  const [pools, setpools] = useState(0);
  const [totalApy, setTotalApy] = useState(0);

  useEffect(async () => {
    const clientAddr = window.ethereum.selectedAddress;
    if (clientAddr) {
      const balance = await balanceOf(clientAddr);
      setsuppliedCapital(toCkb(balance).toFixed(4));
      setpools(balance > 0 ? 1 : 0);
      setTotalApy(10);
    }
  }, []);

  return (
    <div className='bg-gray-50'>
      <Head>
        <title>Insure: Supply Capital</title>
        <meta
          name='description'
          content='Supply capital to cover and earn apy'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='bg-gray-800'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-roboto'>
          <div className='flex items-center justify-between py-10 border border-l-0 border-r-0 border-b-0 border-gray-700'>
            <Stat
              title='Supplied capital'
              amount={suppliedCapital}
              unit='CKB'
              icon={<LibraryIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='Active capital pools'
              amount={pools}
              icon={<ChartPieIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='Total APY'
              amount={totalApy}
              unit='%'
              icon={<TrendingUpIcon className='block h-8 w-8 text-white' />}
            />
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-roboto'>
        <div className='py-10'>
          <div className='grid grid-cols-3 gap-6'>
            <Pool asset='ETH' type='Collateral Protection' />
          </div>
        </div>
      </div>
    </div>
  );
}

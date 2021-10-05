import Head from 'next/head';
import {
  CollectionIcon,
  CashIcon,
  StatusOnlineIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import Stat from '../components/Stat';
import Card from '../components/Card';
import {
  getActiveContractCount,
  getContractCount,
  getTotalContractValue,
} from '../web3/insuranceprovider';
import { toCkb } from '../utils/utils';

export default function Cover() {
  const [coverValue, setCoverValue] = useState(0);
  const [coverCount, setCoverCount] = useState(0);
  const [activeCoverCount, setActiveCoverCount] = useState(0);

  useEffect(async () => {
    const clientAddr = window.ethereum.selectedAddress;
    if (clientAddr) {
      setCoverValue(toCkb(await getTotalContractValue()).toFixed(4));
      setCoverCount(await getContractCount());
      setActiveCoverCount(await getActiveContractCount());
    }
  }, []);

  return (
    <div className='bg-gray-50 font-roboto'>
      <Head>
        <title>Insure: Get Covered</title>
        <meta name='description' content='Get covered' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='bg-gray-800'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-between py-10 border border-l-0 border-r-0 border-b-0 border-gray-700'>
            <Stat
              title='Total cover value'
              amount={coverValue}
              unit='CKB'
              icon={<CashIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='Total covers'
              amount={coverCount}
              icon={<CollectionIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='Total active covers'
              amount={activeCoverCount}
              icon={<StatusOnlineIcon className='block h-8 w-8 text-white' />}
            />
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='py-10'>
          <div className='grid grid-cols-3 gap-6'>
            <Card asset='ETH' type='Collateral Protection' premiumPct='5' />
          </div>
        </div>
      </div>
    </div>
  );
}

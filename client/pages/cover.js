import Head from 'next/head';
import {
  CollectionIcon,
  CashIcon,
  StatusOnlineIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { getReserveAvailableLiquidity } from '../web3/capitalpool';
import { getWeb3 } from '../web3/getWeb3';
import Stat from '../components/Stat';
import Card from '../components/Card';
import {
  getActiveContractCount,
  getContractCount,
  getTotalContractValue,
  newContract,
} from '../web3/insuranceprovider';
import { fromCkb, toCkb } from '../utils/utils';
import Banner from '../components/Banner';

export default function Cover() {
  const [coverValue, setCoverValue] = useState(0);
  const [coverCount, setCoverCount] = useState(0);
  const [activeCoverCount, setActiveCoverCount] = useState(0);
  const [clientAddr, setClientAddr] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchData();
    window.ethereum.on('accountsChanged', fetchData);
  }, []);

  async function fetchData() {
    const client = window.ethereum.selectedAddress;
    if (client) {
      setClientAddr(client);
      setCoverValue(toCkb(await getTotalContractValue()).toFixed(4));
      setCoverCount(await getContractCount());
      setActiveCoverCount(await getActiveContractCount());
    }
  }

  const buyCover = async function (cover, duration, premium) {
    if (cover > 0 && clientAddr) {
      const web3 = await getWeb3();
      const balance = await web3.eth.getBalance(clientAddr);
      const liquidity = await getReserveAvailableLiquidity();
      const totalCovered = await getTotalContractValue();
      setBalance(balance);
      if (balance < fromCkb(premium)) {
        toast.error('Insufficient balance');
      } else if (fromCkb(cover) > liquidity - totalCovered) {
        toast.error(
          'The current Underwriting Capacity of this policy is not sufficient'
        );
      } else {
        toast.promise(
          newContract(
            clientAddr,
            duration * 60, //Seconds in a day. 60 for testing, 86400 for Production,
            fromCkb(premium),
            fromCkb(cover)
          ),
          {
            loading: 'Creating new contract',
            success: () => {
              fetchData();
              return 'Contract created successfully';
            },
            error: 'Failed to create contract',
          }
        );
      }
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen font-roboto'>
      <Head>
        <title>Insure</title>
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
        {clientAddr ? null : (
          <Banner
            msgShort='No account connected!'
            msgLong='No account connected! Please connect your account through
                metamask to use this app.'
          />
        )}
        {balance > 0 ? null : (
          <Banner
            msgShort='No account balance!'
            msgLong='No account balance! Your account has zero balance. To get some balance follow the instructions given '
            link
          />
        )}
        <div className='py-10'>
          <div className='grid grid-cols-3 gap-6'>
            <Card
              asset='ETH'
              type='Collateral Protection'
              premiumPct='5'
              buyCover={buyCover}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

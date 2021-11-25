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
import {
  getActiveContractCount,
  getContractCount,
  getTotalContractValue,
  newContract,
} from '../web3/insuranceprovider';
import { toShannon, fromShannon } from '../utils/utils';
import Banner from '../components/Banner';
import Stat from '../components/Stat';
import Card from '../components/Card';
import Loader from 'react-loader-spinner';

export default function Cover() {
  const [coverValue, setCoverValue] = useState(0);
  const [coverCount, setCoverCount] = useState(0);
  const [activeCoverCount, setActiveCoverCount] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      title: 'TOTAL VALUE COVERED',
      amount: coverValue,
      unit: 'CKB',
      icon: <CashIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'TOTAL COVERS',
      amount: coverCount,
      icon: <CollectionIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'ACTIVE COVERS',
      amount: activeCoverCount,
      icon: <StatusOnlineIcon className='block h-8 w-8 text-white' />,
    },
  ];

  useEffect(() => {
    fetchUserDetails();
    ethereum.on('accountsChanged', fetchUserDetails);
    return () => {
      ethereum.removeListener('accountsChanged', fetchUserDetails);
    };
  }, []);

  async function fetchUserDetails() {
    setLoading(true);
    const address = ethereum.selectedAddress;
    if (address) {
      setUserAddress(address);
      setCoverValue(
        parseFloat(fromShannon(await getTotalContractValue())).toFixed(4)
      );
      setCoverCount(await getContractCount());
      setActiveCoverCount(await getActiveContractCount());
      const web3 = await getWeb3();
      setUserBalance(await web3.eth.getBalance(address));
    }
    setLoading(false);
  }

  const buyCover = async function (cover, duration, premium) {
    if (cover && userAddress) {
      const liquidity = await getReserveAvailableLiquidity();
      const totalCovered = await getTotalContractValue();
      if (userBalance < toShannon(premium)) {
        toast.error('Insufficient balance');
      } else if (toShannon(cover) > liquidity - totalCovered) {
        toast.error(
          'The current Underwriting Capacity of this policy is not sufficient'
        );
      } else {
        toast.promise(
          newContract(
            userAddress,
            duration * 86400, //Seconds in a day. 60 for testing, 86400 for Production,
            toShannon(premium),
            toShannon(cover)
          ),
          {
            loading: 'Creating new contract',
            success: () => {
              fetchUserDetails();
              return 'Contract created successfully';
            },
            error: 'Failed to create contract',
          }
        );
      }
    }
  };

  return (
    <div className='font-inter'>
      <Head>
        <title>Insure</title>
        <meta name='description' content='Get covered' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='bg-gray-900'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-between py-10 border-t border-gray-700'>
            {stats.map((stat) => (
              <Stat
                key={stat.title}
                title={stat.title}
                amount={stat.amount}
                unit={stat.unit}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='py-6'>
          {!loading && !userAddress && (
            <Banner
              msgShort='No account connected!'
              msgLong='No account connected! Please connect your account through
                metamask to use this app.'
            />
          )}
          {!loading && userAddress && !userBalance && (
            <Banner
              msgShort='No account balance!'
              msgLong='No account balance! Your account has zero balance. To get some balance follow the instructions given '
              link
            />
          )}

          {loading ? (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <Loader type='Oval' color='#4338ca' height={100} width={100} />
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-6'>
              <Card
                asset='ETH'
                type='Collateral Protection'
                premiumPct='5'
                buyCover={buyCover}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

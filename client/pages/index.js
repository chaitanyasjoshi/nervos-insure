import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  TagIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';

import Stat from '../components/Stat';
import { getClientContracts } from '../web3/insuranceprovider';
import {
  getContractStatus,
  getPayoutValue,
  getPremium,
} from '../web3/insurancecontract';
import { fromShannon } from '../utils/utils';
import Contract from '../components/Contract';
import Banner from '../components/Banner';

export default function Home() {
  const [contracts, setContracts] = useState([]);
  const [totalCover, setTotalCover] = useState(0);
  const [activeCovers, setActiveCovers] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);

  const stats = [
    {
      title: 'MY COVER',
      amount: totalCover,
      unit: 'CKB',
      icon: <ShieldCheckIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'MY ACTIVE COVERS',
      amount: activeCovers,
      icon: <CollectionIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'INSURANCE FEE',
      amount: insuranceFee,
      unit: 'CKB',
      icon: <TagIcon className='block h-8 w-8 text-white' />,
    },
  ];

  useEffect(() => {
    fetchUserDetails();
    ethereum.on('accountsChanged', fetchUserDetails);
    return () => {
      ethereum.removeListener('accountsChanged', fetchUserDetails);
    };
  }, []);

  const fetchUserDetails = async function () {
    setLoading(true);
    const address = ethereum.selectedAddress;
    if (address) {
      setUserAddress(address);
      const userContracts = await getClientContracts(address);
      if (userContracts.length) {
        setContracts(userContracts);
        let totalPayout = 0;
        let activeCount = 0;
        let totalfee = 0;
        for (const contract of userContracts) {
          const payoutValue = await getPayoutValue(contract);
          const premium = await getPremium(contract);
          const isActive = await getContractStatus(contract);
          if (isActive) activeCount += 1;
          totalPayout =
            parseFloat(totalPayout) + parseFloat(fromShannon(payoutValue));
          totalfee = parseFloat(totalfee) + parseFloat(fromShannon(premium));
        }
        setActiveCovers(activeCount);
        setTotalCover(totalPayout.toFixed(4));
        setInsuranceFee(totalfee.toFixed(4));
      }
    }
    setLoading(false);
  };

  return (
    <div className='font-inter'>
      <Head>
        <title>Insure</title>
        <meta name='description' content='Client covers' />
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
          {!userAddress && !loading && (
            <Banner
              msgShort='No account connected!'
              msgLong='No account connected! Please connect your account through
                metamask to use this app.'
            />
          )}

          {loading ? (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <Loader type='Oval' color='#4338ca' height={100} width={100} />
            </div>
          ) : !contracts.length ? (
            <div className='absolute top-1/2 left-1/2 -ml-40 -mt-40 text-center'>
              <Image
                src='/static/images/not_found.svg'
                alt='not found'
                height='320'
                width='320'
              />
              <p className='pb-6 text-2xl font-light'>No Covers!</p>
              <Link href='/cover'>
                <a className='block m-auto py-2 w-48 text-white bg-indigo-600 rounded-md'>
                  Get covered
                </a>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-6'>
              {contracts.map((contract, i) => (
                <Contract key={i} contract={contract} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

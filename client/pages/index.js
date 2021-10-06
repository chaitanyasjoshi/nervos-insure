import Head from 'next/head';
import {
  ShieldCheckIcon,
  TagIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from 'react-loader-spinner';

import Stat from '../components/Stat';
import { getClientContracts } from '../web3/insuranceprovider';
import {
  getContractStatus,
  getPayoutValue,
  getPremium,
} from '../web3/insurancecontract';
import { toCkb } from '../utils/utils';
import Contract from '../components/Contract';
import Banner from '../components/Banner';

export default function Home() {
  const [contracts, setContracts] = useState([]);
  const [totalCover, setTotalCover] = useState(0);
  const [activeCovers, setActiveCovers] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clientAddr, setClientAddr] = useState(null);

  useEffect(() => {
    fetchClientDetails();
    window.ethereum.on('accountsChanged', fetchClientDetails);
  }, []);

  const fetchClientDetails = async function (_) {
    const client = window.ethereum.selectedAddress;

    if (client) {
      setClientAddr(client);
      setLoading(true);
      const clientContracts = await getClientContracts(client);
      if (clientContracts.length !== 0) {
        setContracts(clientContracts);
        let totalPayout = 0;
        let activeCount = 0;
        let totalfee = 0;
        for (const contract of clientContracts) {
          console.log(contract);
          const payoutValue = await getPayoutValue(contract);
          const premium = await getPremium(contract);
          const isActive = await getContractStatus(contract);
          isActive ? activeCount++ : null;
          totalPayout =
            parseFloat(totalPayout) + parseFloat(toCkb(payoutValue));
          totalfee = parseFloat(totalfee) + toCkb(premium);
        }
        setActiveCovers(activeCount);
        setTotalCover(totalPayout.toFixed(4));
        setInsuranceFee(totalfee.toFixed(4));
      }
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen font-roboto'>
      <Head>
        <title>Insure</title>
        <meta name='description' content='Client covers' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='bg-gray-800'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-between py-10 border border-l-0 border-r-0 border-b-0 border-gray-700'>
            <Stat
              title='My cover'
              amount={totalCover}
              unit='CKB'
              icon={<ShieldCheckIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='My active covers'
              amount={activeCovers}
              icon={<CollectionIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='Insurance fee'
              amount={insuranceFee}
              unit='CKB'
              icon={<TagIcon className='block h-8 w-8 text-white' />}
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
        <div className='py-10'>
          {loading ? (
            <div className='absolute left-1/2 -ml-20 top-1/2'>
              <Loader type='Bars' color='#4338ca' height={100} width={100} />
            </div>
          ) : contracts.length == 0 ? (
            <div className='text-center'>
              <Image
                src='/not_found.svg'
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

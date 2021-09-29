import Head from 'next/head';
import {
  ShieldCheckIcon,
  TagIcon,
  CollectionIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import Card from '../components/Card';

import { getClientContracts } from '../web3/insuranceprovider';
import {
  getContractStatus,
  getPayoutValue,
  getPremium,
} from '../web3/insurancecontract';
import { toCkb } from '../utils/utils';

export default function Home() {
  const [contracts, setContracts] = useState([]);
  const [totalCover, setTotalCover] = useState(0);
  const [activeCovers, setActiveCovers] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(0);

  useEffect(() => {
    fetchClientDetails();
    window.ethereum.on('accountsChanged', fetchClientDetails);
  }, []);

  const fetchClientDetails = async function (_) {
    const clientAddr = window.ethereum.selectedAddress;
    if (clientAddr) {
      const clientContracts = await getClientContracts(clientAddr);
      if (clientContracts.length !== 0) {
        setContracts(clientContracts);
        clientContracts.forEach(async (contract) => {
          const payoutValue = await getPayoutValue(contract);
          const premium = await getPremium(contract);
          const isActive = await getContractStatus(contract);
          if (isActive) {
            setActiveCovers(activeCovers + 1);
          }
          setTotalCover(totalCover + toCkb(payoutValue));
          setInsuranceFee(insuranceFee + toCkb(premium));
        });
      }
    }
  };

  return (
    <div className='bg-gray-50'>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-roboto py-10 '>
        <div className='flex items-center justify-between'>
          <Card
            title='Total cover'
            amount={totalCover}
            unit='CKB'
            icon={<ShieldCheckIcon className='block h-8 w-8 text-white' />}
          />
          <Card
            title='No of active covers'
            amount={activeCovers}
            icon={<CollectionIcon className='block h-8 w-8 text-white' />}
          />
          <Card
            title='Insurance fee'
            amount={insuranceFee}
            unit='CKB'
            pm
            icon={<TagIcon className='block h-8 w-8 text-white' />}
          />
        </div>
      </div>
    </div>
  );
}

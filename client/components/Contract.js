import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckIcon, DuplicateIcon } from '@heroicons/react/outline';
import moment from 'moment';

import {
  getContractPaid,
  getContractStartDate,
  getContractStatus,
  getDuration,
  getPayoutValue,
  getPremium,
} from '../web3/insurancecontract';
import { fromShannon } from '../utils/utils';

export default function Contract({ contract }) {
  const [isActive, setIsActive] = useState(true);
  const [utilized, setUtilized] = useState(false);
  const [premium, setPremium] = useState(0);
  const [payoutValue, setPayoutValue] = useState(0);
  const [endDate, setEndDate] = useState('-');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchContractDetails();
  }, []);

  async function fetchContractDetails() {
    const startDate = await getContractStartDate(contract);
    const duration = await getDuration(contract);
    setIsActive(await getContractStatus(contract));
    setUtilized(await getContractPaid(contract));
    setPremium(parseFloat(fromShannon(await getPremium(contract))).toFixed(4));
    setPayoutValue(
      parseFloat(fromShannon(await getPayoutValue(contract))).toFixed(4)
    );
    setEndDate(
      moment.unix(parseInt(startDate) + parseInt(duration)).format('L')
    );
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(contract)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='p-6 w-96 rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center pb-6 border border-l-0 border-t-0 border-r-0 border-gray-200'>
        <div className='pr-6'>
          <Image
            src='/static/images/eth.png'
            alt='eth'
            width='24'
            height='36'
          />
        </div>
        <div>
          <p className='font-bold'>ETH</p>
          <p className='text-sm font-light text-gray-500'>
            Collateral Protection
          </p>
        </div>
        <div className='ml-auto flex flex-col items-end'>
          {isActive ? (
            <p className='px-2 text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800'>
              ACTIVE
            </p>
          ) : (
            <p className='px-2 text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800'>
              EXPIRED
            </p>
          )}
          <p className='px-2 mt-2 text-xs leading-5 font-medium rounded-full bg-indigo-100 text-indigo-800'>
            {utilized ? 'UTILIZED' : 'UNUTILIZED'}
          </p>
        </div>
      </div>
      <div className='py-3 border-b border-gray-200 flex items-center justify-between'>
        <div>
          <p className='text-sm font-light text-gray-500'>Address</p>
          <p className='text-sm'>
            {contract.slice(0, 28)}...{contract.slice(-4)}
          </p>
        </div>
        <div className='px-2 cursor-pointer' onClick={handleCopyClick}>
          {isCopied ? (
            <CheckIcon className='block h-6 w-6 text-green-500' />
          ) : (
            <DuplicateIcon className='block h-6 w-6 text-gray-500' />
          )}
        </div>
      </div>
      <div className='flex items-center justify-between pt-6'>
        <div>
          <p className='text-sm font-light text-gray-500'>Premium</p>
          <p className='text-sm'>{premium} CKB</p>
        </div>
        <div>
          <p className='text-sm font-light text-gray-500'>My Cover</p>
          <p className='text-sm'>{payoutValue} CKB</p>
        </div>
        <div>
          <p className='text-sm font-light text-gray-500'>End Date</p>
          <p className='text-sm'>{isActive ? endDate : 'Ended'}</p>
        </div>
      </div>
    </div>
  );
}

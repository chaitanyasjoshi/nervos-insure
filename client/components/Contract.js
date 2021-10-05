import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  getContractPaid,
  getContractStartDate,
  getContractStatus,
  getDuration,
  getPayoutValue,
  getPremium,
} from '../web3/insurancecontract';
import moment from 'moment';
import { toCkb } from '../utils/utils';

export default function Contract({ contract }) {
  const [isActive, setIsActive] = useState(true);
  const [utilized, setUtilized] = useState(false);
  const [premium, setPremium] = useState(0);
  const [payoutValue, setPayoutValue] = useState(0);
  const [endDate, setEndDate] = useState(moment.unix(new Date()).format('L'));

  useEffect(async () => {
    const isContractActive = await getContractStatus(contract);
    const isContractUtilized = await getContractPaid(contract);
    const contractPremium = await getPremium(contract);
    const coverValue = await getPayoutValue(contract);
    const startDate = await getContractStartDate(contract);
    const duration = await getDuration(contract);
    setIsActive(isContractActive);
    setUtilized(isContractUtilized);
    setPremium(toCkb(contractPremium).toFixed(4));
    setPayoutValue(toCkb(coverValue).toFixed(4));
    setEndDate(
      moment.unix(parseInt(startDate) + parseInt(duration)).format('L')
    );
  }, []);

  return (
    <div className='p-6 w-96 rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center pb-6 border border-l-0 border-t-0 border-r-0 border-gray-200'>
        <div className='pr-6'>
          <Image src='/eth.png' alt='eth' width='24' height='36' />
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
          <p className='text-sm'>{endDate}</p>
        </div>
      </div>
    </div>
  );
}

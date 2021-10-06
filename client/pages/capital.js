import React from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import moment from 'moment';

import Stat from '../components/Stat';
import {
  ChartPieIcon,
  LibraryIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import {
  balanceOf,
  deposit,
  getReserveAvailableLiquidity,
  getWithdrawalUnlockDate,
  withdraw,
} from '../web3/capitalpool';
import { fromCkb, toCkb } from '../utils/utils';
import { getWeb3 } from '../web3/getWeb3';

import Pool from '../components/Pool';
import Banner from '../components/Banner';

export default function Capital() {
  const [suppliedCapital, setsuppliedCapital] = useState(0);
  const [pools, setpools] = useState(0);
  const [totalApy, setTotalApy] = useState('-');
  const [clientAddr, setClientAddr] = useState(null);
  const [balance, setBalance] = useState(1);

  useEffect(() => {
    fetchData();
    window.ethereum.on('accountsChanged', fetchData);
  }, []);

  async function fetchData() {
    const client = window.ethereum.selectedAddress;
    if (client) {
      setClientAddr(client);
      const balance = await balanceOf(window.ethereum.selectedAddress);
      setsuppliedCapital(toCkb(balance).toFixed(4));
      setpools(balance > 0 ? 1 : 0);

      const web3 = await getWeb3();
      const clientBalance = await web3.eth.getBalance(client);
      setBalance(clientBalance);
    }
  }

  const supplyCapital = async function (supplyAmount) {
    if (supplyAmount > 0 && clientAddr) {
      if (balance < fromCkb(supplyAmount)) {
        toast.error('Insufficient balance');
      } else {
        toast.promise(deposit(fromCkb(supplyAmount), clientAddr), {
          loading: 'Depositing capital...',
          success: () => {
            fetchData();
            return 'Deposit successful';
          },
          error: 'Deposit failed',
        });
      }
    }
  };

  const withdrawCapital = async function (withdrawAmount) {
    if (withdrawAmount > 0 && clientAddr) {
      const deposit = await balanceOf(clientAddr);
      const liquidity = await getReserveAvailableLiquidity();
      const unlockDate = await getWithdrawalUnlockDate(clientAddr);
      if (deposit < fromCkb(withdrawAmount)) {
        toast.error(
          'Deposited capital is insufficient to proceed with withdrawal'
        );
      } else if (fromCkb(withdrawAmount) > liquidity) {
        toast.error(
          'Capital pool liquidity is insufficient to proceed with withdrawal'
        );
      } else if (moment.unix(new Date()) < unlockDate) {
        toast.error(
          `Your funds will be unlocked for withdrawal on ${moment
            .unix(unlockDate)
            .format('L')}`
        );
      } else {
        toast.promise(withdraw(fromCkb(withdrawAmount), clientAddr), {
          loading: 'Withdrawing capital...',
          success: () => {
            fetchData();
            return 'Withdrawal successful';
          },
          error: 'Withdrawal failed',
        });
      }
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen font-roboto'>
      <Head>
        <title>Insure</title>
        <meta
          name='description'
          content='Supply capital to cover and earn apy'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='bg-gray-800'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-10 border border-l-0 border-r-0 border-b-0 border-gray-700'>
            <Stat
              title='My supplied capital'
              amount={suppliedCapital}
              unit='CKB'
              icon={<LibraryIcon className='block h-8 w-8 text-white' />}
            />
            <Stat
              title='My active capital pools'
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
            <Pool
              asset='ETH'
              type='Collateral Protection'
              supplyCapital={supplyCapital}
              withdrawCapital={withdrawCapital}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import {
  ChartPieIcon,
  LibraryIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';

import {
  balanceOf,
  deposit,
  getReserveAvailableLiquidity,
  getWithdrawalUnlockDate,
  withdraw,
} from '../web3/capitalpool';
import { toShannon, fromShannon } from '../utils/utils';
import { getWeb3 } from '../web3/getWeb3';

import Stat from '../components/Stat';
import Pool from '../components/Pool';
import Banner from '../components/Banner';
import Loader from 'react-loader-spinner';

export default function Capital() {
  const [suppliedCapital, setsuppliedCapital] = useState(0);
  const [pools, setpools] = useState(0);
  const [totalApy, setTotalApy] = useState('-');
  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      title: 'MY SUPPLIED CAPITAL',
      amount: suppliedCapital,
      unit: 'CKB',
      icon: <LibraryIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'MY ACTIVE POOLS',
      amount: pools,
      icon: <ChartPieIcon className='block h-8 w-8 text-white' />,
    },
    {
      title: 'TOTAL APY',
      amount: totalApy,
      unit: '%',
      icon: <TrendingUpIcon className='block h-8 w-8 text-white' />,
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
      const userDeposit = await balanceOf(ethereum.selectedAddress);
      setsuppliedCapital(parseFloat(fromShannon(userDeposit)).toFixed(4));
      setpools(userDeposit > 0 ? 1 : 0);

      const web3 = await getWeb3();
      setUserBalance(await web3.eth.getBalance(address));
    }
    setLoading(false);
  }

  const supplyCapital = async function (supplyAmount) {
    if (supplyAmount && userAddress) {
      if (userBalance < toShannon(supplyAmount)) {
        toast.error('Insufficient balance');
      } else {
        toast.promise(deposit(toShannon(supplyAmount), userAddress), {
          loading: 'Depositing capital...',
          success: () => {
            fetchUserDetails();
            return 'Deposit successful';
          },
          error: 'Deposit failed',
        });
      }
    }
  };

  const withdrawCapital = async function (withdrawAmount) {
    if (withdrawAmount && userAddress) {
      const userDeposit = await balanceOf(userAddress);
      const poolLiquidity = await getReserveAvailableLiquidity();
      const userDepositUnlockDate = await getWithdrawalUnlockDate(userAddress);
      if (userDeposit < toShannon(withdrawAmount)) {
        toast.error(
          'Deposited capital is insufficient to proceed with withdrawal'
        );
      } else if (toShannon(withdrawAmount) > poolLiquidity) {
        toast.error(
          'Capital pool liquidity is insufficient to proceed with withdrawal'
        );
      } else if (moment.unix(new Date()) < userDepositUnlockDate) {
        toast.error(
          `Your funds will be unlocked for withdrawal on ${moment
            .unix(userDepositUnlockDate)
            .format('L')}`
        );
      } else {
        toast.promise(withdraw(toShannon(withdrawAmount), userAddress), {
          loading: 'Withdrawing capital...',
          success: () => {
            fetchUserDetails();
            return 'Withdrawal successful';
          },
          error: 'Withdrawal failed',
        });
      }
    }
  };

  return (
    <div className='font-inter'>
      <Head>
        <title>Insure</title>
        <meta
          name='description'
          content='Supply capital to cover and earn apy'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='bg-gray-900'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-10 border-t border-gray-700'>
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
        <div className='py-10'>
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
              <Pool
                asset='ETH'
                type='Collateral Protection'
                supplyCapital={supplyCapital}
                withdrawCapital={withdrawCapital}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

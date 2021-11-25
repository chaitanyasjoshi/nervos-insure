import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getWeb3 } from '../web3/getWeb3';

const navigation = [
  { name: 'MY COVERS', href: '/' },
  { name: 'GET COVERED', href: '/cover' },
  { name: 'SUPPLY CAPITAL', href: '/capital' },
];

export default function Navbar() {
  const [userAddress, setUserAddress] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setAddress();
  }, []);

  const connect = async function () {
    await getWeb3();
    setAddress();
  };

  const setAddress = function () {
    const address = ethereum.selectedAddress;
    if (address) setUserAddress(address);
  };

  return (
    <Disclosure as='nav' className='bg-gray-900 font-inter'>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
            <div className='relative flex items-center justify-between h-20'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex-shrink-0 flex items-center'>
                  <img
                    className='block lg:hidden h-auto w-40'
                    src='/static/images/logo.png'
                    alt='Insure'
                  />
                  <img
                    className='hidden lg:block h-auto w-40'
                    src='/static/images/logo.png'
                    alt='Insure'
                  />
                </div>
                <div className='hidden sm:block sm:m-auto'>
                  <div className='flex space-x-4'>
                    {navigation.map((item) => (
                      <Link href={item.href} key={item.name}>
                        <a
                          className={`${
                            router.pathname === item.href
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                          }
                            ' px-3 py-2 rounded-md text-sm font-medium'`}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className='bg-indigo-700 text-white font-medium w-max px-6 py-2 rounded-lg'
                onClick={connect}
              >
                <span>
                  {userAddress
                    ? `${userAddress.slice(0, 10)}...${userAddress.slice(-4)}`
                    : 'Connect Wallet'}
                </span>
              </button>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navigation.map((item) => (
                <Link href={item.href} key={item.name}>
                  <a
                    className={`${
                      router.pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                      ' block px-3 py-2 rounded-md text-base font-medium'`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

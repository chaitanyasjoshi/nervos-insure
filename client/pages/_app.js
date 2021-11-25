import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            minWidth: '250px',
            fontFamily: 'inter',
          },
        }}
      />
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

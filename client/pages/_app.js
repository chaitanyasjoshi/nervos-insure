import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            minWidth: '250px',
            fontFamily: 'roboto',
          },
        }}
      />
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

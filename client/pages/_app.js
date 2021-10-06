import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Toaster position='top-right' />
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

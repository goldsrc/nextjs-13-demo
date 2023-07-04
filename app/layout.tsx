import NavMenu from '@/app/NavMenu';
import './globals.css';
import {Open_Sans} from 'next/font/google';
import Link from 'next/link';
import AuthProvider from './AuthProvider';

const myFont = Open_Sans({weight: '400', subsets: ['latin']});

export const metadata = {
  title: 'Next 13.4 Demo',
  description: 'Next 13.4 Demo with app router and layout',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({children}: Props) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={myFont.className}>
          <div className="container">
            <NavMenu />
            <main>{children}</main>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}

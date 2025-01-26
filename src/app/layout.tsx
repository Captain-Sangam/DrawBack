import './globals.css';
import { Righteous } from 'next/font/google';
import ThemeLayout from './components/ThemeLayout';

const righteous = Righteous({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous'
});

export const metadata = {
  title: 'DrawBack - Drawing App with Undo/Redo',
  description: 'A simple drawing app with undo/redo functionality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={righteous.variable}>
      <ThemeLayout>
        {children}
      </ThemeLayout>
    </html>
  );
}

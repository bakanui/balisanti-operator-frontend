'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar'
import { Footer } from './components/Footer';
import { HeaderBar } from './components/HeaderBar'
import { SidebarComponent } from './components/SidebarComponent'
import './globals.css'
import { getStorageValue } from './utils/localstoreage';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = usePathname();
  const routerAction = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(()=>{
   const auth = getStorageValue('auth');
   console.log('auth = ', auth);
   if(auth) {
      setIsLogin(true);
   } else {
      routerAction.replace('/login');
   }
  },[]);

  if (process.env.NODE_ENV === "production")
    console.log = function no_console() {};
    
  if (router && router.includes('/login')){
    return(
      <html className='scroll-smooth' lang="en">
      <head />
      <body>
        <div id="root"></div>
        <div id="loading"/>
        {children}
      </body>
    </html>
    );
  };

  return (
    <html className='scroll-smooth' lang="en">
      <head />
      <body>
        <div id="root"></div>
        <div id="loading"/>
        <ProSidebarProvider>
          <div className='h-screen flex overflow-hidden'>
            <SidebarComponent />
            <main className="bg-background dark: dark:bg-slate-800 w-full relative">
              <HeaderBar />
              <div className="min-h-full overflow-y-auto">
                  {children}
              </div>
            </main>
          </div>
        </ProSidebarProvider>
      </body>
    </html>
  )
}

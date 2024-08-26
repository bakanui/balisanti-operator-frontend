import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu, menuClasses } from 'react-pro-sidebar';
import { SideMenuItem } from './SideMenuItem';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon } from '@/assets/svg/DashboardIcon';
import { MasterDataIcon } from '@/assets/svg/MasterDataIcon';
import { TicketIcon } from '@/assets/svg/TicketIcon';
import { UserIcon } from '@/assets/svg/UserIcon';
import { ReportIcon } from '@/assets/svg/ReportIcon';
import { ShipStoreIcon } from '@/assets/svg/ShipStoreIcon';
import { PassangerIcon } from '@/assets/svg/PassangerIcon';
import { DermagaIcon } from '@/assets/svg/DermagaIcon';
import { RuteIcon } from '@/assets/svg/RuteIcon';
import { SopIcon } from '@/assets/svg/SopIcon';
import { CustomerIcon } from '@/assets/svg/CustomerIcon';
import { AgenIcon } from '@/assets/svg/AgenIcon';
import { NahkodaIcon } from '@/assets/svg/NahkodaIcon';
import { Jadwallcon } from '@/assets/svg/Jadwallcon';
import { HargaIcon } from '@/assets/svg/HargaIcon';
import { ManifestIcon } from '@/assets/svg/ManifestIcon';
import { MoneyIcon } from '@/assets/svg/MoneyIcon';
import { PrinterIcon } from '@/assets/svg/PrinterIcon';
import { ScanIcon } from '@/assets/svg/ScanIcon';
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react';
import { getStorageValue } from '../utils/localstoreage';
import { IUsers } from '../types/auth';

export const SidebarComponent = () => {
    const { collapsed } = useProSidebar();
    const router = usePathname();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [mode, setMode] = useState<'dark'| 'light'>('light');
    const [user, setUser] = useState<IUsers | null>(null);
    
    useEffect(() => {
        let isLight = window.matchMedia('(prefers-color-scheme: light)');
        setMode(isLight.matches ? 'light' : 'dark');
        
        const event =  window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', event => {
            const colorScheme = event.matches ? "dark" : "light";
            setMode(colorScheme);
        });

        let tmp = getStorageValue('auth');
        if (tmp) {
            setUser(tmp.user);
        }

        return () => {
            event
        }
      }, []);
    
    return(
        <Sidebar 
            backgroundColor={mode == 'dark' ? '#1e293b' : '#fff'}
            collapsedWidth={isTabletOrMobile ? '0' : undefined} 
            defaultCollapsed={isTabletOrMobile}
            rootStyles={{border: 'none'}}
        >
        <Menu>
            <div className='flex items-center py-4'>
                {collapsed ? 
                    <div className='w-full h-[40px] bg-[url(./../assets/logo-only.png)] bg-contain bg-no-repeat bg-center'></div>
                :
                    <div className='w-full h-[40px] bg-[url(./../assets/logo-primary.png)] bg-contain bg-no-repeat bg-left ml-[10%]'></div>
                }
            </div>
        </Menu>
        <Menu 
            closeOnClick
            menuItemStyles={{
            button: ({ level, active, disabled }) => {
                return {
                    backgroundColor: active ? '#008AA1' : undefined,
                    width: '80%',
                    marginBottom: '2px',
                    color: active || mode == 'dark' ? '#fff' : 'black',
                    alignSelf: 'center',
                    marginLeft: '10%',
                    borderRadius: '10px',
                    '&:hover': {
                        backgroundColor: active || mode == 'dark' ? '#016070' : '#e2e8f0',
                      },
                };
            },
            }}
        >
            {user && user.id_role == 1 ? 
                <>
                <MenuItem 
                    active={router == '/'} 
                    icon={<DashboardIcon fill={router == '/' || mode == 'dark' ? 'white' : undefined} />}
                    component={<Link href={'/'} />} 
                >
                    <span className='font-robotoregular text-sm'>Dashboard</span>
                </MenuItem>
                <SubMenu
                    active={router?.includes('/master-data')}
                    label="Master Data" 
                    icon={<MasterDataIcon fill={router?.includes('/master-data') || mode == 'dark' ? 'white' : undefined} />}
                    rootStyles={{
                        fontSize: '14px',
                        ['.' + menuClasses.subMenuContent]: {
                        backgroundColor: mode == 'dark' ? '#1e293b' : '#fff',
                        fontSize: '14px'
                        },
                    }}
                >
                    <SideMenuItem
                        text='Jenis Kapal'
                        path={router}
                        icon={<ShipStoreIcon fill={router?.includes('/master-data/jenis-kapal') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/jenis-kapal'
                    />
                    <SideMenuItem
                        text='Data Kapal'
                        path={router}
                        icon={<ShipStoreIcon fill={router?.includes('/master-data/kapal') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/kapal'
                    />
                    <SideMenuItem 
                        text='Jenis Penumpang'
                        path={router}
                        icon={<PassangerIcon fill={router?.includes('/master-data/penumpang') || mode == 'dark' ? 'white' : '#3E3E3F'} />}
                        href='/master-data/penumpang'
                    />
                    <SideMenuItem 
                        text='Data Dermaga'
                        path={router}
                        icon={<DermagaIcon fill={router?.includes('/master-data/dermaga') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/dermaga'
                    />
                    <SideMenuItem 
                        text='Rute Perjalanan'
                        path={router}
                        icon={<RuteIcon fill={router?.includes('/master-data/rute') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/rute'
                    />
                    <SideMenuItem 
                        text='SOP'
                        path={router}
                        icon={<SopIcon fill={router?.includes('/master-data/sop') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/sop'
                    />
                    {/* <SideMenuItem 
                        text='Pelanggan'
                        path={router}
                        icon={<CustomerIcon fill={router?.includes('/master-data/pelanggan') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/pelanggan'
                    /> */}
                    <SideMenuItem 
                        text='Data Agen'
                        path={router}
                        icon={<AgenIcon fill={router?.includes('/master-data/agen') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/agen'
                    />
                    <SideMenuItem 
                        text='Data Nahkoda'
                        path={router}
                        icon={<NahkodaIcon fill={router?.includes('/master-data/nahkoda') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/nahkoda'
                    />
                    <SideMenuItem 
                        text='Kecakapan Nahkoda'
                        path={router}
                        icon={<NahkodaIcon fill={router?.includes('/master-data/kecakapan') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/kecakapan'
                    />
                    <SideMenuItem 
                        text='Jadwal & Tiket'
                        path={router}
                        icon={<Jadwallcon fill={router?.includes('/master-data/jadwal') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/jadwal'
                    />
                    <SideMenuItem 
                        text='Harga Service'
                        path={router}
                        icon={<HargaIcon fill={router?.includes('/master-data/service') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/service'
                    />
                    <SideMenuItem 
                        text='Users'
                        path={router}
                        icon={<UserIcon fill={router?.includes('/master-data/operator') || mode == 'dark' ? 'white' : undefined} />}
                        href='/master-data/operator'
                    />
                    {/* <MenuItem 
                        component={<Link href={'/operator'} />}
                        active={router == '/operator'} 
                        icon={<UserIcon fill={router == '/operator' || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Users</span>
                    </MenuItem> */}
                </SubMenu>
                <MenuItem 
                    active={router?.includes('/penjualan-tiket')} 
                    component={<Link href={'/penjualan-tiket'} />} 
                    icon={<TicketIcon fill={router?.includes('/penjualan-tiket') || mode == 'dark' ? 'white' : undefined} />}
                >
                    <span className='font-robotoregular text-sm'>Penjualan Tiket</span>
                </MenuItem>
                <MenuItem 
                    active={router?.includes('/edit-invoice')} 
                    component={<Link href={'/edit-invoice'} />} 
                    icon={<SopIcon fill={router?.includes('/edit-invoice') || mode == 'dark' ? 'white' : undefined} />}
                >
                    <span className='font-robotoregular text-sm'>Edit Invoice</span>
                </MenuItem>
                <MenuItem 
                    active={router?.includes('/pembayaran-agen')} 
                    component={<Link href={'/pembayaran-agen'} />} 
                    icon={<UserIcon fill={router?.includes('/pembayaran-agen') || mode == 'dark' ? 'white' : undefined} />}
                >
                    <span className='font-robotoregular text-sm'>Pembayaran Agen</span>
                </MenuItem>

                <MenuItem 
                    component={<Link href={'/cetak-tiket'} />}
                    active={router == '/cetak-tiket'} 
                    icon={<PrinterIcon fill={router == '/cetak-tiket' || mode == 'dark' ? 'white' : undefined} />}
                >
                    <span className='font-robotoregular text-sm'>Cetak Tiket</span>
                </MenuItem>

                <SubMenu
                    active={router?.includes('/laporan')}
                    label="Laporan" 
                    icon={<ReportIcon fill={router?.includes('/laporan') || mode == 'dark' ? 'white' : undefined} />}
                    rootStyles={{
                        fontSize: '14px',
                        ['.' + menuClasses.subMenuContent]: {
                        backgroundColor: mode == 'dark' ? '#1e293b' : '#fff',
                        fontSize: '14px'
                        },
                    }}
                >
                    <SideMenuItem
                        text='Operator'
                        path={router}
                        icon={<UserIcon fill={router?.includes('/laporan/operator') || mode == 'dark' ? 'white' : undefined} />}
                        href='/laporan/operator'
                    />
                    <SideMenuItem
                        text='Penumpang'
                        path={router}
                        icon={<UserIcon fill={router?.includes('/laporan/penumpang') || mode == 'dark' ? 'white' : undefined} />}
                        href='/laporan/penumpang'
                    />
                    {/* <SideMenuItem
                        text='Agen'
                        path={router}
                        icon={<UserIcon fill={router?.includes('/laporan/agen') || mode == 'dark' ? 'white' : undefined} />}
                        href='/laporan/agen'
                    /> */}
                    {/* <SideMenuItem
                        text='Manifest'
                        path={router}
                        icon={<ManifestIcon fill={router?.includes('/laporan/manifest') || mode == 'dark' ? 'white' : undefined} />}
                        href='/laporan/manifest'
                    /> */}
                </SubMenu>
                </>
            : 
            user && user.id_role == 2 ? 
                <>
                    <MenuItem 
                        active={router == '/'} 
                        icon={<DashboardIcon fill={router == '/' || mode == 'dark' ? 'white' : undefined} />}
                        component={<Link href={'/'} />} 
                    >
                        <span className='font-robotoregular text-sm'>Dashboard</span>
                    </MenuItem>
                    <MenuItem 
                        active={router?.includes('/penjualan-tiket')} 
                        component={<Link href={'/penjualan-tiket'} />} 
                        icon={<TicketIcon fill={router?.includes('/penjualan-tiket') || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Penjualan Tiket</span>
                    </MenuItem>
                    <MenuItem 
                        active={router?.includes('/edit-invoice')} 
                        component={<Link href={'/edit-invoice'} />} 
                        icon={<SopIcon fill={router?.includes('/edit-invoice') || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Edit Invoice</span>
                    </MenuItem>
                    <MenuItem 
                        component={<Link href={'/pembayaran'} />}
                        active={router == '/pembayaran'} 
                        icon={<MoneyIcon fill={router == '/pembayaran' || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Pembayaran</span>
                    </MenuItem>
                    <MenuItem 
                        component={<Link href={'/cetak-tiket'} />}
                        active={router == '/cetak-tiket'} 
                        icon={<PrinterIcon fill={router == '/cetak-tiket' || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Cetak Tiket</span>
                    </MenuItem>
                    <SubMenu
                        active={router?.includes('/laporan')}
                        label="Laporan" 
                        icon={<ReportIcon fill={router?.includes('/laporan') || mode == 'dark' ? 'white' : undefined} />}
                        rootStyles={{
                            fontSize: '14px',
                            ['.' + menuClasses.subMenuContent]: {
                            backgroundColor: mode == 'dark' ? '#1e293b' : '#fff',
                            fontSize: '14px'
                            },
                        }}
                    >
                        <SideMenuItem
                            text='Operator'
                            path={router}
                            icon={<UserIcon fill={router?.includes('/laporan/operator') || mode == 'dark' ? 'white' : undefined} />}
                            href='/laporan/operator'
                        />
                        <SideMenuItem
                            text='Penumpang'
                            path={router}
                            icon={<UserIcon fill={router?.includes('/laporan/penumpang') || mode == 'dark' ? 'white' : undefined} />}
                            href='/laporan/penumpang'
                        />
                    </SubMenu>
                </>
            :
                <>
                    <SubMenu
                        active={router?.includes('/laporan')}
                        label="Laporan" 
                        icon={<ReportIcon fill={router?.includes('/laporan') || mode == 'dark' ? 'white' : undefined} />}
                        rootStyles={{
                            fontSize: '14px',
                            ['.' + menuClasses.subMenuContent]: {
                            backgroundColor: mode == 'dark' ? '#1e293b' : '#fff',
                            fontSize: '14px'
                            },
                        }}
                    >
                        <SideMenuItem
                            text='Penumpang'
                            path={router}
                            icon={<UserIcon fill={router?.includes('/laporan/penumpang') || mode == 'dark' ? 'white' : undefined} />}
                            href='/laporan/penumpang'
                        />
                    </SubMenu>
                    <MenuItem 
                        component={<Link href={'/scan'} />}
                        active={router == '/scan'} 
                        icon={<ScanIcon fill={router == '/scan' || mode == 'dark' ? 'white' : undefined} />}
                    >
                        <span className='font-robotoregular text-sm'>Scan Tiket</span>
                    </MenuItem>
                </>
            }
        </Menu>
        {!collapsed && <div className='flex p-3 py-6 font-robotoregular text-xs items-center justify-center bottom-0'>Design & Developed by <span className='text-primary font-robotomedium ml-1'> Maiharta</span></div>}
      </Sidebar>
    );
}
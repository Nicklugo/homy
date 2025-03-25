'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  BuildingStorefrontIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'HOMY', href: '/', icon: HomeIcon },
    { name: 'My Home', href: '/my-home', icon: BuildingStorefrontIcon },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCartIcon },
    { name: 'End of Month Order', href: '/order', icon: CalendarIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-gradient-to-r from-navy-dark via-navy-main to-navy-light backdrop-blur-sm bg-opacity-90 px-4 flex items-center justify-between z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                nav-item flex flex-col items-center px-3 py-1 rounded-md text-sm font-medium 
                transition-all duration-200 ease-in-out
                ${pathname === item.href 
                  ? 'text-white bg-navy-light bg-opacity-50' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation; 
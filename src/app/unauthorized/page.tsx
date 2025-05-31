'use client';

import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

const messages = {
  en: {
    title: "Access Denied",
    subtitle: "Only users with @infi.us email addresses can access this system",
    contactAdmin: "If you are a company employee, please contact the administrator for access",
    signOut: "Sign Out",
    tryAnother: "Sign in with another account",
  },
  zh: {
    title: "访问被拒绝",
    subtitle: "只有使用 @infi.us 邮箱的用户才能访问此系统",
    contactAdmin: "如果您是公司员工，请联系管理员获取访问权限",
    signOut: "退出登录",
    tryAnother: "使用其他账户登录",
  }
};

export default function UnauthorizedPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('zh');
  const t = messages[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setLanguage('zh')}
            className={`px-3 py-1 text-sm rounded ${
              language === 'zh' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            中文
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm rounded ${
              language === 'en' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            English
          </button>
        </div>

        <div>
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.subtitle}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {t.contactAdmin}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <SignOutButton>
              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                {t.signOut}
              </button>
            </SignOutButton>
          </div>
          
          <div>
            <Link href="/sign-in" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {t.tryAnother}
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>SQL脚本管理系统 - 仅限内部使用</p>
        </div>
      </div>
    </div>
  );
} 
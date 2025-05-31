'use client';

import { SignUp } from '@clerk/nextjs';
import { useState } from 'react';

const messages = {
  en: {
    title: "Create Invited Account",
    subtitle: "🔒 This system uses invitation-only registration",
    onlyInvited: "Only users who received admin invitations can create accounts",
    noInvitation: "If you haven't received an invitation email, please contact the system administrator",
    registrationNotice: "Registration Notice",
    inviteOnly: "System uses invitation-only registration to ensure access security",
    emailOnly: "Please use @infi.us enterprise email",
    waitApproval: "Registration requires administrator approval",
  },
  zh: {
    title: "受邀创建账户",
    subtitle: "🔒 此系统采用邀请制注册",
    onlyInvited: "只有收到管理员邀请的用户才能创建账户",
    noInvitation: "如果您没有收到邀请邮件，请联系系统管理员",
    registrationNotice: "注册须知",
    inviteOnly: "系统采用邀请制，确保访问安全",
    emailOnly: "请使用 @infi.us 企业邮箱",
    waitApproval: "注册后需等待管理员审核",
  }
};

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'zh'>('zh');
  const t = messages[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 语言切换 */}
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t.title}
          </h2>
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-blue-600 font-medium">
              {t.subtitle}
            </p>
            <p className="text-sm text-gray-600">
              {t.onlyInvited}
            </p>
            <p className="text-xs text-gray-500">
              {t.noInvitation}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                card: 'shadow-lg',
              }
            }}
            routing="path"
            path="/sign-up"
            redirectUrl="/"
          />
        </div>
        
        {/* 提示信息 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {t.registrationNotice}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t.inviteOnly}</li>
                  <li>{t.emailOnly}</li>
                  <li>{t.waitApproval}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
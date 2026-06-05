import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from '@/components/common/Providers';
import './globals.css';

const outfitFont = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'BiteBot — AI Cooking & Recipe Assistant',
  description: 'Craft customized recipes, discover dishes matching your ingredients, and chat with your personal AI kitchen coach.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfitFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Anti-FOUC script — runs synchronously before first paint.
          Uses the same key as ThemeSwitcher: 'bitebot-theme'
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bitebot-theme')||'system';var d=document.documentElement;var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==='system'&&p)){d.classList.add('dark')}else{d.classList.remove('dark')}d.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-orange-50/50 text-stone-900 transition-colors duration-300 dark:bg-zinc-900 dark:text-orange-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

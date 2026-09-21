import type { Metadata } from 'next';
import './globals.css';
const socialTitle = "Michelle Roby's Brand Transformation | FORDIVINE";
const description = 'See how Michelle Roby turned her business experience with no digital presence into a personal brand that attracted consulting clients and paid speaking inquiries.';
const socialImage = {url:'/crowned-stories/michelle-roby/images/michelle-brand-overview.png',width:1263,height:712,alt:'Michelle Roby’s gold wordmark and monogram on a deep green textured background'};
export const metadata: Metadata = {
  metadataBase:new URL('https://www.fordivine.com'),
  title:'Michelle Roby’s Brand Transformation | FORDIVINE',
  description,
  robots:{index:true,follow:true},
  alternates:{canonical:'https://www.fordivine.com/crowned-stories/michelle-roby'},
  openGraph:{title:socialTitle,description,url:'https://www.fordivine.com/crowned-stories/michelle-roby',type:'article',locale:'en_US',images:[socialImage]},
  twitter:{card:'summary_large_image',title:socialTitle,description,images:[socialImage]},
  icons:{
    icon:[
      {url:'/crowned-stories/michelle-roby/fordivine-icon-light.png',media:'(prefers-color-scheme: light)',type:'image/png'},
      {url:'/crowned-stories/michelle-roby/fordivine-icon-dark.png',media:'(prefers-color-scheme: dark)',type:'image/png'}
    ],
    shortcut:'/crowned-stories/michelle-roby/fordivine-icon-light.png',
    apple:'/crowned-stories/michelle-roby/fordivine-apple-icon.png'
  }
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="preload" href="/crowned-stories/michelle-roby/fonts/helvetica-bold-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/crowned-stories/michelle-roby/fonts/proxima-regular-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>}

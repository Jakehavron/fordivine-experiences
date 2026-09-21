import type { Metadata } from 'next';
import './globals.css';
const socialTitle = 'Dr. Stephanie Byerly’s Brand Transformation | FORDIVINE';
const description = 'How Dr. Stephanie Byerly built a distinct coaching and speaking brand with FORDIVINE, attracting paying clients and new speaking opportunities.';
export const metadata: Metadata = {
  metadataBase:new URL('https://www.fordivine.com'),
  title:'Dr. Stephanie Byerly | Crowned Stories | FORDIVINE',
  description,
  robots:{index:true,follow:true},
  alternates:{canonical:"https://www.fordivine.com/crowned-stories/stephanie-byerly"},
  openGraph:{title:socialTitle,description,type:'article',locale:'en_US',url:'https://www.fordivine.com/crowned-stories/stephanie-byerly',images:[{url:'/crowned-stories/stephanie-byerly/images/stephanie-media-kit.jpg',width:1440,height:809,alt:'Dr. Stephanie Byerly, MD'}]},
  twitter:{card:'summary_large_image',title:socialTitle,description,images:['/crowned-stories/stephanie-byerly/images/stephanie-media-kit.jpg']},
  icons:{
    icon:[
      {url:'/crowned-stories/stephanie-byerly/fordivine-icon-light.png',media:'(prefers-color-scheme: light)',type:'image/png'},
      {url:'/crowned-stories/stephanie-byerly/fordivine-icon-dark.png',media:'(prefers-color-scheme: dark)',type:'image/png'}
    ],
    shortcut:'/crowned-stories/stephanie-byerly/fordivine-icon-light.png',
    apple:'/crowned-stories/stephanie-byerly/fordivine-apple-icon.png'
  }
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="preload" href="/crowned-stories/stephanie-byerly/fonts/helvetica-bold-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/crowned-stories/stephanie-byerly/fonts/proxima-regular-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><noscript><style>{"@font-face{font-family:'Bebas Neue';src:url('/crowned-stories/stephanie-byerly/fonts/bebas-neue-latin.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}@font-face{font-family:Discovery Inter;src:url('/crowned-stories/stephanie-byerly/fonts/inter-latin-optimized.woff2') format('woff2');font-weight:300 800;font-display:swap}"}</style></noscript>{children}</body></html>}

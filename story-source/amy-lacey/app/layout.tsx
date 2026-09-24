import type { Metadata } from 'next';
import './globals.css';
const socialTitle = 'Amy Lacey’s Brand Transformation | FORDIVINE';
const description = 'How FORDIVINE helped Amy Lacey clarify her message and build a founder-led brand around faith, speaking, and her next chapter.';
export const metadata: Metadata = {
  metadataBase:new URL('https://www.fordivine.com'),
  title:socialTitle,
  description,
  robots:{index:true,follow:true},
  alternates:{canonical:"https://www.fordivine.com/crowned-stories/amy-lacey"},
  openGraph:{title:socialTitle,description,type:'article',locale:'en_US',url:'https://www.fordivine.com/crowned-stories/amy-lacey',images:[{url:'https://www.fordivine.com/crowned-stories/amy-lacey/images/amy-identity-v1.webp',width:1030,height:584,alt:'Amy Lacey signature brand identity by FORDIVINE'}]},
  twitter:{card:'summary_large_image',title:socialTitle,description,images:[{url:'https://www.fordivine.com/crowned-stories/amy-lacey/images/amy-stationery-v1.webp',alt:'Faithfully Found mockups with translucent envelopes and branded stationery, created for Amy Lacey by FORDIVINE'}]},
  icons:{
    icon:[
      {url:'/crowned-stories/amy-lacey/fordivine-icon-light.png',media:'(prefers-color-scheme: light)',type:'image/png'},
      {url:'/crowned-stories/amy-lacey/fordivine-icon-dark.png',media:'(prefers-color-scheme: dark)',type:'image/png'}
    ],
    shortcut:'/crowned-stories/amy-lacey/fordivine-icon-light.png',
    apple:'/crowned-stories/amy-lacey/fordivine-apple-icon.png'
  }
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="preload" href="/crowned-stories/amy-lacey/fonts/helvetica-bold-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/crowned-stories/amy-lacey/fonts/proxima-regular-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" as="image" type="image/avif" imageSrcSet="/crowned-stories/amy-lacey/images/amy-portrait-328-v4.avif 328w, /crowned-stories/amy-lacey/images/amy-portrait-420-v4.avif 420w, /crowned-stories/amy-lacey/images/amy-portrait-500-v4.avif 500w, /crowned-stories/amy-lacey/images/amy-portrait-656-v4.avif 656w" imageSizes="(max-width: 700px) min(238px, calc((100vw - 72px) * .743)), (max-width: 1000px) calc((100vw - 116px) * .2914), min(327px, calc((97.5vw - 120px) * .2914))" fetchPriority="high"/><link rel="preload" href="/crowned-stories/amy-lacey/fonts/proxima-bold-optimized.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><noscript><style>{"@font-face{font-family:'Bebas Neue';src:url('/crowned-stories/amy-lacey/fonts/bebas-neue-latin.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}@font-face{font-family:Discovery Inter;src:url('/crowned-stories/amy-lacey/fonts/inter-latin-optimized.woff2') format('woff2');font-weight:300 800;font-display:swap}"}</style></noscript>{children}</body></html>}

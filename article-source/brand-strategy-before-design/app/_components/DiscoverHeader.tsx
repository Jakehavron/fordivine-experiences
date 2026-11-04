import Script from "next/script";
import { discoverHeaderHtml } from "../../lib/site-chrome";
export default function DiscoverHeader(){return <><div dangerouslySetInnerHTML={{__html:discoverHeaderHtml}} /><Script src="https://www.fordivine.com/shared/glass-navigation.js?v=1" strategy="afterInteractive" /></>;}

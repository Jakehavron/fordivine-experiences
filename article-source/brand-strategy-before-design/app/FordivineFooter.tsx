import Image from "next/image";

export default function FordivineFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="footer-logo" href="https://www.fordivine.com/discover" aria-label="FORDIVINE home">
            <Image
              className="footer-wordmark"
              src="/fordivine-logo-white.png"
              alt="FORDIVINE"
              width={1287}
              height={201}
            />
          </a>
          <p>
            An Authority Engineering House helping women
            <br />
            become Crowned Authorities™ in their space.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="https://www.fordivine.com/discover">Home</a>
          <a href="https://www.fordivine.com/crowned-stories">Crowned Stories</a>
          <a href="https://www.fordivine.com/discover#book">Inquire Now</a>
        </nav>
      </div>

      <p className="footer-question-line">
        Got a question? Email{" "}
        <a
          className="footer-question-link"
          href="mailto:Hello@fordivine.com?subject=I%20have%20a%20question!%20re%3A%20Discovery%20page&body=Hi%20team!%0A%0AI%20have%20a%20question%20regarding..%20(insert%20your%20details%20here)"
        >
          Hello@fordivine.com
        </a>
      </p>

      <div className="footer-legal">
        <a href="https://www.fordivine.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        <a href="https://www.fordivine.com/terms-of-use" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
      </div>

      <p className="footer-disclaimer">
        Emily Ford and FORDIVINE™&apos;s results are not typical and are not a guarantee of your success. Your
        results will vary depending on your effort, application, experience, and background. We do not give
        investment, tax, or other professional advice. The information contained within this website is the
        property of Fortitude LLC. Any use of the images, content, or ideas expressed herein without the express
        written consent of Fortitude LLC is prohibited. Copyright © 2025 FORDIVINE™. All Rights Reserved.
      </p>
    </footer>
  );
}

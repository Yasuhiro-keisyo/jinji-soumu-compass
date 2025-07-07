export default function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="bg-neutral-dark mt-12 py-8">
        <div className="container mx-auto text-center text-neutral-light">
          <p>© {currentYear} 人事総務の羅針盤. All Rights Reserved.</p>
        </div>
      </footer>
    )
  }
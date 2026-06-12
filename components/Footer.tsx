export default function Footer() {
  return (
    <footer className="py-10 bg-espresso border-t border-espresso-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <a href="/" className="font-serif font-light text-cream tracking-[0.25em] uppercase text-sm select-none">
          Curated
        </a>

        <p className="text-cream/20 text-xs font-sans tracking-wider text-center">
          &copy; {new Date().getFullYear()} Curated. Jakarta, Indonesia.{' '}
          <span className="hidden sm:inline">Serious relationships for ambitious professionals.</span>
        </p>

        <nav className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-cream/20 text-xs font-sans tracking-wide hover:text-cognac/60 transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

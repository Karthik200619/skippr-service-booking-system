function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} Skippr. All rights reserved.</p>
        <p>Secure dashboard, slot booking, and responsive pages for every screen.</p>
      </div>
    </footer>
  );
}

export default Footer;
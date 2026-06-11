import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="relative h-screen bg-white font-sans flex flex-col overflow-hidden selection:bg-gray-900 selection:text-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-emerald-400 opacity-[0.07] blur-[100px]"></div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; opacity: 0; }
        .delay-200 { animation-delay: 200ms; opacity: 0; }
        .delay-300 { animation-delay: 300ms; opacity: 0; }
      `}} />

      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex justify-between items-center shrink-0 z-10 animate-fade-up">
        <div className="flex items-center gap-2">
          <img src="/navape-logo.svg" alt="logo" className="w-8 h-8" />
          <span className="text-xl font-semibold text-gray-900 tracking-tight">NavaPe</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 shadow-sm hover:shadow-md transition-all">
            Register
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto z-10">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-gray-900 mb-6 leading-[1.1] animate-fade-up delay-100">
          Digital payments,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">simplified.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-10 leading-relaxed animate-fade-up delay-200">
          Experience seamless peer-to-peer transfers, secure passcode authentication, and simulated bank top-ups in a clean, high-performance sandbox environment.
        </p>
        <div className="animate-fade-up delay-300">
          <Link to="/register" className="group relative inline-flex items-center justify-center bg-gray-900 text-white text-lg font-medium px-8 py-3.5 rounded-full hover:-translate-y-0.5 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transition-all duration-300">
            Create an account
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      <section className="shrink-0 w-full max-w-6xl mx-auto px-4 pb-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left border-t border-gray-100/50 z-10 animate-fade-up delay-300">
        <div className="p-4 rounded-2xl hover:bg-gray-50/80 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Instant Transfers</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Send simulated funds to anyone on the NavaPe network instantly using just a phone number and a secure 4-digit PIN.
          </p>
        </div>
        
        <div className="p-4 rounded-2xl hover:bg-gray-50/80 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Bank Simulation</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Add test money to your wallet using our mock payment gateway featuring real-world HMAC-SHA256 cryptographic signatures.
          </p>
        </div>

        <div className="p-4 rounded-2xl hover:bg-gray-50/80 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto md:mx-0">
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">ACID Compliance</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Built on a robust PostgreSQL architecture with row-level locking to ensure zero double-spending and strict data integrity.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
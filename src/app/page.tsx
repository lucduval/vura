import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import ProblemSolution from '@/components/landing/ProblemSolution';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Contact from '@/components/landing/Contact';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import { LogoText } from '@/components/ui/logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navbar Placeholder */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <LogoText />
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#pricing" className="hover:text-primary">Pricing</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
          <div className="flex gap-4">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-sm font-medium hover:underline flex items-center">Login</button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

        </div>
      </header>

      <Hero />
      <ProblemSolution />
      <Features />
      <Pricing />
      <HowItWorks />
      <FAQ />
      <Contact />
      <Footer />
    </main >
  );
}

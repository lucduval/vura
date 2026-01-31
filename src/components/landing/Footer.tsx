import { LogoText } from '@/components/ui/logo';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <LogoText />
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Simplifying accounting for small businesses on WhatsApp. Automated, secure, and effortless.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#features" className="text-slate-600 hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#pricing" className="text-slate-600 hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors">How it Works</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Reviews</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Legal & Social Column */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm mb-6">
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Cookie Policy</a></li>
                        </ul>

                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Vura. All rights reserved.</p>
                    <p>Made in Cape Town, South Africa 🇿🇦</p>
                </div>
            </div>
        </footer>
    );
}

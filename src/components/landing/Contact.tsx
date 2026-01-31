import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Get in Touch
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Have questions? We'd love to hear from you. Reach out to our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                    {/* Contact Details */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex items-start">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mr-6">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Email us</h3>
                                <p className="text-slate-600 mb-2">Our friendly team is here to help.</p>
                                <a href="mailto:hello@vura.co.za" className="text-primary font-medium hover:underline">
                                    hello@vura.co.za
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex items-start">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mr-6">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Call us</h3>
                                <p className="text-slate-600 mb-2">Mon-Fri from 8am to 5pm.</p>
                                <a href="tel:+27211234567" className="text-primary font-medium hover:underline">
                                    +27 (0) 21 123 4567
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex items-start">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mr-6">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Visit us</h3>
                                <p className="text-slate-600 mb-2">Come say hello at our office HQ.</p>
                                <address className="text-slate-900 not-italic">
                                    15 Techno Park<br />
                                    Stellenbosch<br />
                                    Cape Town, 7600
                                </address>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="first-name" className="text-sm font-medium text-slate-900">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        placeholder="John"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last-name" className="text-sm font-medium text-slate-900">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        placeholder="Doe"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="john@example.com"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-900">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="How can we help you?"
                                    rows={4}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Shield, Hammer, CreditCard, ChevronRight, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#008751]/5 to-transparent">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-outfit leading-tight mb-6">
              Build Safe <br /> <span className="text-[#008751]">From Anywhere.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              The Trust-as-a-Service platform for Nigerians in the diaspora. Build your dream home without the fear of fraud or mismanagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-primary flex items-center justify-center gap-2 text-lg">
                Start Building <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/builders" className="btn-outline flex items-center justify-center gap-2 text-lg">
                Browse Verified Builders
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#008751] w-5 h-5" /> Verified Pros
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#008751] w-5 h-5" /> Milestone Escrow
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#008751] w-5 h-5" /> Real-time Tracking
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full aspect-square bg-[#008751]/10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              {/* Image Placeholder - In real app use generate_image or stock */}
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <Hammer className="w-32 h-32 text-slate-400 opacity-30" />
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div>
                  <h4 className="font-bold">Emeka Obi</h4>
                  <p className="text-xs text-slate-500">London, UK</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 italic">"Finally, I can build my house in Lagos without worrying about where the money is going."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section id="how-it-works" className="py-24 bg-white px-6">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">How BuildSafe Protects You</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We bridge the gap between your hard-earned money and your dream project in Nigeria.</p>
        </div>

        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="w-8 h-8 text-[#008751]" />,
              title: "Verified Pro Finder",
              desc: "Every builder on BuildSafe is manually vetted. We verify CAC registration, NIN, and past project quality."
            },
            {
              icon: <CreditCard className="w-8 h-8 text-[#008751]" />,
              title: "Milestone Escrow",
              desc: "Your funds are held in escrow. Builders only get paid when you (and our inspectors) approve the work."
            },
            {
              icon: <Hammer className="w-8 h-8 text-[#008751]" />,
              title: "Real-time Evidence",
              desc: "Builders upload GPS-tagged photos and videos for every milestone so you can track progress daily."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto bg-[#008751] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-outfit">Ready to build your dream home?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">Join thousands of Nigerians abroad who trust BuildSafe for their construction management.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-white text-[#008751] px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-100 transition-colors shadow-2xl">
                Get Started Now
              </Link>
              <Link href="/builders" className="border-2 border-white/30 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/10 transition-colors">
                View Pro Builders
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-[#008751] w-8 h-8" />
              <span className="text-3xl font-bold font-outfit">BuildSafe</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Building trust in the Nigerian construction industry. Managed from anywhere, built locally.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Links</h4>
            <div className="flex flex-col gap-4 text-slate-400">
              <Link href="/builders">Find Builders</Link>
              <Link href="/project">Your Projects</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <div className="flex flex-col gap-4 text-slate-400 text-sm">
              <p>support@buildsafeng.com</p>
              <p>Lagos: Victoria Island</p>
              <p>London: Canary Wharf</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-slate-800 text-slate-500 text-sm flex justify-between">
          <p>© 2024 BuildSafe Nigeria. All rights reserved.</p>
          <p>Proudly Nigerian 🇳🇬</p>
        </div>
      </footer>
    </div>
  );
}

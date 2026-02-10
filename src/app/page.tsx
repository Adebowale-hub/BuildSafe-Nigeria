'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Hammer, CreditCard, ChevronRight, CheckCircle2, Users, TrendingUp, DollarSign, Star, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#008751]/20 to-[#00a362]/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          className="container mx-auto relative z-10"
          style={{ opacity, scale }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Trust Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="w-4 h-4 text-[#008751]" />
                <span className="text-sm font-semibold text-[#008751]">Trusted by 500+ Diaspora Nigerians</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6">
                Build Safe <br />
                <span className="text-gradient">From Anywhere.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                The Trust-as-a-Service platform for Nigerians in the diaspora. Build your dream home without the fear of fraud or mismanagement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/signup" className="btn-gradient flex items-center justify-center gap-2 text-lg group">
                  Start Building
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/builders" className="btn-outline flex items-center justify-center gap-2 text-lg">
                  Browse Verified Builders
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: CheckCircle2, label: "Verified Pros", color: "text-emerald-600" },
                  { icon: Shield, label: "Milestone Escrow", color: "text-blue-600" },
                  { icon: TrendingUp, label: "Real-time Tracking", color: "text-amber-600" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-construction.png"
                  alt="Modern Nigerian construction site with professionals"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Floating Stats Card */}
                <motion.div
                  className="absolute top-6 right-6 card-glass backdrop-blur-xl p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">₦2.5B+</p>
                      <p className="text-xs text-slate-600">Funds Protected</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Testimonial Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 max-w-sm card-glass p-6 backdrop-blur-xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    <Image
                      src="/testimonial-avatar.png"
                      alt="Emeka Obi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Emeka Obi</h4>
                    <p className="text-sm text-slate-500">London, UK</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "Finally, I can build my house in Lagos without worrying about where the money is going."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Active Projects", icon: Building2 },
              { value: "200+", label: "Verified Builders", icon: Users },
              { value: "₦2.5B+", label: "Funds Protected", icon: Shield },
              { value: "98%", label: "Success Rate", icon: TrendingUp }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary mb-4">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How BuildSafe <span className="text-gradient">Protects You</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We bridge the gap between your hard-earned money and your dream project in Nigeria with cutting-edge trust infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Verified Pro Finder",
                desc: "Every builder on BuildSafe is manually vetted. We verify CAC registration, NIN, and past project quality.",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: CreditCard,
                title: "Milestone Escrow",
                desc: "Your funds are held in escrow. Builders only get paid when you (and our inspectors) approve the work.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Hammer,
                title: "Real-time Evidence",
                desc: "Builders upload GPS-tagged photos and videos for every milestone so you can track progress daily.",
                color: "from-amber-500 to-amber-600"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card-hover p-8 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          className="container mx-auto relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-br from-[#008751] via-[#00a362] to-[#008751] rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  x: [0, -30, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Ready to build your <br className="hidden md:block" />dream home?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of Nigerians abroad who trust BuildSafe for their construction management. Start building with confidence today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup" className="bg-white text-[#008751] px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 group">
                  Get Started Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/builders" className="border-2 border-white/40 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                  View Pro Builders
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">BuildSafe</span>
              </div>
              <p className="text-slate-400 max-w-md mb-8 text-lg leading-relaxed">
                Building trust in the Nigerian construction industry. Managed from anywhere, built locally with transparency and accountability.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <div className="flex flex-col gap-4 text-slate-400">
                <Link href="/builders" className="hover:text-white transition-colors">Find Builders</Link>
                <Link href="/lands" className="hover:text-white transition-colors">Browse Land</Link>
                <Link href="/project" className="hover:text-white transition-colors">Your Projects</Link>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <div className="flex flex-col gap-4 text-slate-400">
                <p>support@buildsafeng.com</p>
                <p>Lagos: Victoria Island</p>
                <p>London: Canary Wharf</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
            <p>© 2024 BuildSafe Nigeria. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Proudly Nigerian <span className="text-lg">🇳🇬</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

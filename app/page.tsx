'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GraduationCap, Briefcase, Award, ArrowRight, CheckCircle2, Star, Users, Zap, Sparkles, BookOpen, Rocket } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with curriculum designed for the modern job market.",
    icon: GraduationCap,
    color: "#0A5C4A",
    delay: 0.1
  },
  {
    title: "Verified Badges",
    description: "Earn digital badges that represent your skills and are verified by Leapfrog Connect.",
    icon: Award,
    color: "#F5A623",
    delay: 0.2
  },
  {
    title: "Direct Hiring",
    description: "Top companies in Nepal use our platform to find and hire certified talent directly.",
    icon: Briefcase,
    color: "#1E88E5",
    delay: 0.3
  },
  {
    title: "Skill Assessments",
    description: "Validate your expertise with rigorous assessments that prove you're ready for the job.",
    icon: Zap,
    color: "#7C3AED",
    delay: 0.4
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 overflow-hidden selection:bg-[#0A5C4A]/30 selection:text-[var(--color-text-primary)]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 flex items-center min-h-[90vh]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#0A5C4A]/10 dark:bg-[#10B981]/15 blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#1E88E5]/10 dark:bg-[#3B82F6]/15 blur-[120px]" 
            />
            <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#7C3AED]/10 dark:bg-[#8B5CF6]/15 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--color-border)] shadow-sm mb-8"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A5C4A] opacity-75 dark:bg-[#10B981]"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0A5C4A] dark:bg-[#10B981]"></span>
                </div>
                <span className="text-[var(--color-text-primary)] text-sm font-semibold tracking-wide">
                  Empowering 10,000+ Learners in Nepal
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--color-text-primary)] mb-8 leading-[1.05]"
              >
                Learn. Build. <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] via-[#1E88E5] to-[#7C3AED] dark:from-[#10B981] dark:via-[#3B82F6] dark:to-[#8B5CF6] animate-gradient-x">
                  Get Hired.
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed font-light"
              >
                The ultimate platform connecting ambitious talent with top companies. Master in-demand skills, earn verified credentials, and accelerate your career.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-5"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-8 text-lg rounded-2xl bg-gradient-to-r from-[#0A5C4A] to-[#0d7a63] hover:from-[#0d7a63] hover:to-[#0A5C4A] dark:from-[#10B981] dark:to-[#059669] text-white shadow-xl shadow-[#0A5C4A]/20 dark:shadow-[#10B981]/20 transition-all duration-300 hover:scale-[1.02]">
                    Start Learning Free <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register?role=company" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-8 text-lg rounded-2xl border-2 border-[var(--color-border)] hover:bg-[var(--color-muted)] text-[var(--color-text-primary)] transition-all duration-300 hover:scale-[1.02] glass">
                    Hire Top Talent
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-20 pt-10 border-t border-[var(--color-border)] flex flex-wrap justify-center gap-8 md:gap-16 text-[var(--color-text-secondary)]"
              >
                {[
                  { icon: CheckCircle2, text: "Industry Verified", color: "text-[#10B981]" },
                  { icon: Users, text: "Active Community", color: "text-[#3B82F6]" },
                  { icon: Sparkles, text: "Modern Curriculum", color: "text-[#8B5CF6]" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05, color: 'var(--color-text-primary)' }}
                    className="flex items-center gap-3 cursor-default transition-colors duration-300"
                  >
                    <div className={`p-2 rounded-full bg-[var(--color-muted)] ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm md:text-base font-semibold tracking-wide">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            style={{ opacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[var(--color-text-secondary)] text-xs font-semibold tracking-widest uppercase">Scroll Discover</span>
            <div className="w-6 h-10 border-2 border-[var(--color-border)] rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-[var(--color-bg-primary)] relative border-y border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] uppercase tracking-[0.2em] mb-4">
                  The Platform Advantage
                </h2>
                <h3 className="text-4xl lg:text-5xl font-black text-[var(--color-text-primary)]">
                  Everything you need to <span className="text-gradient">succeed</span>
                </h3>
              </motion.div>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} whileHover={{ y: -8 }} className="h-full">
                  <div className="h-full p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-500 group relative overflow-hidden">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div 
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm"
                      style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                    >
                      <feature.icon size={28} strokeWidth={2.5} />
                    </div>
                    <h4 className="relative text-2xl font-bold text-[var(--color-text-primary)] mb-4">{feature.title}</h4>
                    <p className="relative text-[var(--color-text-secondary)] leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Impact Section / Dashboard Preview */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="text-4xl lg:text-5xl font-black text-[var(--color-text-primary)] mb-6 leading-tight">
                    Your entire learning journey, <br className="hidden lg:block"/>
                    <span className="text-gradient">beautifully tracked.</span>
                  </h2>
                  <p className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                    Experience a world-class dashboard designed to keep you motivated. Track your progress, view your earned badges, and connect with employers all in one place.
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Real-time SCORM progress tracking",
                      "Instant verified certificate generation",
                      "Direct employer visibility for top performers"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-[var(--color-text-primary)] font-medium">
                        <div className="p-1 rounded-full bg-[#0A5C4A]/10 dark:bg-[#10B981]/15 text-[#0A5C4A] dark:text-[#10B981]">
                          <CheckCircle2 size={18} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg)] hover:bg-[var(--color-text-secondary)] transition-colors">
                      Explore Dashboard <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                
                {/* Abstract Dashboard Visual */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative perspective-1000"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#0A5C4A]/20 to-[#1E88E5]/20 dark:from-[#10B981]/20 dark:to-[#3B82F6]/20 rounded-3xl blur-3xl transform -rotate-6 scale-105" />
                   
                   <div className="relative glass border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-2xl">
                      {/* Fake Dashboard Header */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--color-border)]">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] flex items-center justify-center text-white font-bold text-xl">S</div>
                            <div>
                               <div className="h-5 w-32 bg-[var(--color-text-primary)] rounded-md opacity-20 mb-2"></div>
                               <div className="h-3 w-20 bg-[var(--color-text-secondary)] rounded-md opacity-20"></div>
                            </div>
                         </div>
                         <div className="h-10 w-24 rounded-full bg-[#0A5C4A]/10 dark:bg-[#10B981]/15 border border-[#0A5C4A]/20 dark:border-[#10B981]/20 flex items-center justify-center">
                            <span className="text-[#0A5C4A] dark:text-[#10B981] text-xs font-bold px-2">PRO</span>
                         </div>
                      </div>
                      
                      {/* Fake Progress */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                            <div className="h-4 w-24 bg-[var(--color-text-secondary)] opacity-20 rounded mb-4"></div>
                            <div className="text-3xl font-black text-[var(--color-text-primary)] mb-2">84%</div>
                            <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                               <div className="bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] h-full w-[84%] rounded-full"></div>
                            </div>
                         </div>
                         <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                            <div className="h-4 w-24 bg-[var(--color-text-secondary)] opacity-20 rounded mb-4"></div>
                            <div className="text-3xl font-black text-[var(--color-text-primary)] mb-2">3</div>
                            <div className="flex gap-2">
                               {[1,2,3].map(i => (
                                 <div key={i} className="w-8 h-8 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center">
                                    <Award size={14} className="text-[#F5A623]" />
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Fake Course List */}
                      <div className="space-y-4">
                         {[1,2].map(i => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                              <div className="w-12 h-12 rounded-xl bg-[var(--color-muted)] flex-shrink-0"></div>
                              <div className="flex-grow">
                                 <div className="h-4 w-full max-w-[200px] bg-[var(--color-text-primary)] opacity-20 rounded mb-2"></div>
                                 <div className="h-3 w-32 bg-[var(--color-text-secondary)] opacity-20 rounded"></div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center flex-shrink-0">
                                <ArrowRight size={14} className="text-[var(--color-text-secondary)]" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-[2.5rem] p-10 lg:p-20 text-center overflow-hidden"
            >
              {/* Premium Dark Gradient for CTA */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F] via-[#14141A] to-[#0B0B0F] z-0" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay" />
              
              {/* Glow effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#0A5C4A]/30 dark:bg-[#10B981]/20 blur-[100px] z-0 pointer-events-none" />
              
              <div className="relative z-10">
                <Rocket className="w-16 h-16 mx-auto mb-8 text-[#10B981]" strokeWidth={1.5} />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                  Ready to Accelerate <br className="hidden sm:block"/> Your Career?
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                  Join Leapfrog Connect today and take the first step towards your dream job.
                  Verified skills, verified employers, real results.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl bg-white text-[#0B0B0F] hover:bg-gray-100 transition-all duration-300 hover:scale-[1.03] shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      Join as a Student
                    </Button>
                  </Link>
                  <Link href="/register?role=company" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.03]">
                      Join as a Company
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-bg-sidebar)] border-t border-[var(--color-border)] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] flex items-center justify-center shadow-lg">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">
                  Leapfrog<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6]">Connect</span>
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] max-w-sm leading-relaxed mb-6">
                Bridging the gap between ambitious learners and innovative companies in Nepal through verified skills and direct hiring.
              </p>
            </div>
            
            <div>
               <h4 className="font-bold text-[var(--color-text-primary)] mb-6">Platform</h4>
               <ul className="space-y-4 text-[var(--color-text-secondary)] font-medium">
                  <li><Link href="/courses" className="hover:text-[var(--color-primary)] transition-colors">Courses</Link></li>
                  <li><Link href="/companies" className="hover:text-[var(--color-primary)] transition-colors">For Companies</Link></li>
                  <li><Link href="/assessments" className="hover:text-[var(--color-primary)] transition-colors">Assessments</Link></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold text-[var(--color-text-primary)] mb-6">Legal</h4>
               <ul className="space-y-4 text-[var(--color-text-secondary)] font-medium">
                  <li><Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
                  <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
               </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              &copy; {mounted ? new Date().getFullYear() : '2024'} Leapfrog Connect. All rights reserved.
            </p>
            <div className="flex gap-4">
               {/* Social Icons would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

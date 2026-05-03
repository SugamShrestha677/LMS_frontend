'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, Briefcase, Award, ArrowRight, CheckCircle2, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with curriculum designed for the modern job market.",
    icon: GraduationCap,
    color: "#0A5C4A"
  },
  {
    title: "Verified Badges",
    description: "Earn digital badges that represent your skills and are verified by Leapfrog Connect.",
    icon: Award,
    color: "#F5A623"
  },
  {
    title: "Direct Hiring",
    description: "Top companies in Nepal use our platform to find and hire certified talent directly.",
    icon: Briefcase,
    color: "#1E88E5"
  },
  {
    title: "Skill Assessments",
    description: "Validate your expertise with rigorous assessments that prove you're ready for the job.",
    icon: Zap,
    color: "#7C3AED"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0A5C4A]/5 blur-[120px]" />
            <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-[#1E88E5]/5 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A5C4A]/10 border border-[#0A5C4A]/20 text-[#0A5C4A] text-xs font-bold mb-6"
              >
                <Star size={14} className="fill-[#0A5C4A]" />
                <span>Trusted by 500+ Top Companies in Nepal</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-black tracking-tight text-[#1E1E2A] mb-8 leading-[1.1]"
              >
                Bridge the Gap Between <br />
                <span className="text-gradient">Education & Employment</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg lg:text-xl text-[#5A5A6E] mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Upskill with industry-verified courses, earn digital badges, and get 
                fast-tracked to interviews with Nepal's leading companies.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                  Start Your Journey <ArrowRight size={20} className="ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-lg">
                  For Companies
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-16 flex flex-wrap justify-center gap-8 text-[#5A5A6E]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#0A5C4A]" />
                  <span className="text-sm font-medium">Verified Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#0A5C4A]" />
                  <span className="text-sm font-medium">10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-[#0A5C4A]" />
                  <span className="text-sm font-medium">2,500+ Placements</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-[#0A5C4A] uppercase tracking-wider mb-3">Core Features</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-[#1E1E2A]">Everything You Need to Succeed</h3>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Card hover className="h-full group">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                    >
                      <feature.icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-[#1E1E2A] mb-3">{feature.title}</h4>
                    <p className="text-[#5A5A6E] leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="gradient-hero rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[30%] h-full bg-white/5 skew-x-[30deg] translate-x-20" />
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-5xl font-black mb-6">Ready to Accelerate Your Career?</h2>
                <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join Leapfrog Connect today and take the first step towards your dream job.
                  Verified skills, verified employers, real results.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 text-lg text-[#1E1E2A]">
                      Join as a Student
                    </Button>
                  </Link>
                  <Link href="/register?role=company" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg border-white text-white hover:bg-white hover:text-[#0A5C4A]">
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
      <footer className="bg-[#FAFAFA] border-t border-[#e5e7eb] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-[#1E1E2A]">
                Leapfrog<span className="text-[#0A5C4A]">Connect</span>
              </span>
            </div>
            
            <div className="flex gap-8 text-sm text-[#5A5A6E] font-medium">
              <Link href="#" className="hover:text-[#0A5C4A] transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#0A5C4A] transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-[#0A5C4A] transition-colors">Contact Us</Link>
            </div>
            
            <p className="text-xs text-[#9ca3af]">
              &copy; {new Date().getFullYear()} Leapfrog Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

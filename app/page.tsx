"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, MessageCircle, TrendingUp, Shield, Moon, Sparkles, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { motion } from "framer-motion"
import "./faq-animate.css"
import React from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

function FAQList() {
  const faqs = [
    {
      q: "What is MindfulAI?",
      a: "MindfulAI is an AI-powered mental health platform offering therapy chat, mood tracking, and interactive therapeutic activities to support your well-being.",
    },
    {
      q: "Is my data private and secure?",
      a: "Yes. Your privacy is our top priority. All conversations and mood data are encrypted and never shared without your consent.",
    },
    {
      q: "Can I use MindfulAI for crisis situations?",
      a: "MindfulAI offers real-time crisis detection and resources, but it is not a substitute for professional help. If you are in crisis, please contact a mental health professional or emergency services.",
    },
    {
      q: "How much does it cost?",
      a: "You can get started for free! We offer premium features for advanced analytics and personalized care, but the core experience is always accessible.",
    },
    {
      q: "Who is behind MindfulAI?",
      a: "MindfulAI is built by a team of mental health professionals, AI researchers, and passionate developers dedicated to making mental wellness accessible to all.",
    },
  ]
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className={
            "border border-primary/15 rounded-xl bg-background/90 shadow-sm transition-all overflow-hidden" +
            (openIndex === i ? " shadow-lg" : "")
          }
        >
          <button
            className={
              "w-full flex items-center gap-3 cursor-pointer text-lg font-semibold text-left px-6 py-4 select-none transition-colors group " +
              (openIndex === i ? "bg-primary/5 text-primary" : "")
            }
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="flex-1">{faq.q}</span>
            <span
              className={
                "transition-transform duration-300 text-xl text-primary/70" +
                (openIndex === i ? " rotate-90" : "")
              }
            >
              &#8250;
            </span>
          </button>
          <div
            className={"faq-animate px-6 pb-4 pt-1" + (openIndex === i ? " open" : "")}
            aria-hidden={openIndex !== i}
          >
            <p className="text-muted-foreground text-base leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b glass-card sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindfulAI
            </h1>
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="hover:bg-primary/10">
                  Sign In
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              className="absolute -top-4 -right-4 text-secondary"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            <h2 className="text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Your Personal AI Therapist
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Experience compassionate AI-powered therapy with real-time emotional support, mood tracking, and interactive
            therapeutic activities designed for your mental wellness journey.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="group">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
                >
                  Try Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Comprehensive Mental Health Support
        </motion.h3>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: MessageCircle,
              title: "AI Therapy Chat",
              description: "Engage in meaningful conversations with our emotionally intelligent AI therapist",
            },
            {
              icon: Shield,
              title: "Crisis Detection",
              description: "Real-time monitoring and immediate support during mental health crises",
            },
            {
              icon: Heart,
              title: "Mood Tracking",
              description: "Track your emotional patterns with AI-powered insights and recommendations",
            },
            {
              icon: Moon,
              title: "Therapeutic Activities",
              description: "Interactive breathing exercises, zen gardens, and mindfulness practices",
            },
            {
              icon: TrendingUp,
              title: "Progress Analytics",
              description: "Visualize your mental health journey with detailed progress tracking",
            },
            {
              icon: Brain,
              title: "Personalized Care",
              description: "Tailored therapeutic approaches based on your unique needs and preferences",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover">
              <Card className="border-0 shadow-lg hover:shadow-2xl glass-card h-full group cursor-pointer">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 w-fit"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-secondary transition-colors" />
                  </motion.div>
                  <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="relative bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute top-10 left-10 text-primary/20"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Heart className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-secondary/20"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <Brain className="h-20 w-20" />
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 text-balance"
          >
            Ready to Begin Your Mental Health Journey?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto"
          >
            Join thousands who have found support, healing, and growth with MindfulAI
          </motion.p>
          <Link href="/auth/signup">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl"
              >
                Get Started Today
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* FAQ Section - Animated */}
      <motion.section
        className="container mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Frequently Asked Questions
        </h3>
        <FAQList />
      </motion.section>

      <motion.footer
        className="border-t bg-muted/30 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div className="flex items-center justify-center gap-2 mb-4" whileHover={{ scale: 1.05 }}>
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindfulAI
            </span>
          </motion.div>
          <p className="text-muted-foreground">&copy; 2025 MindfulAI. Your mental health matters.</p>
          <p className="animate-pulse mt-1">Built By Raghav Katta</p>
        </div>
      </motion.footer>
    </div>
  )
}

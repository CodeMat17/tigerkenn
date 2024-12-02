'use client'

import { motion } from "framer-motion"
import {
  Award,
  Clock,
  HeartHandshake,
  Lightbulb,
  Shield,
  ThumbsUp,
} from "lucide-react"

const reasons = [
  {
    icon: Award,
    title: "Excellence",
    description: "Award-winning designs and construction quality.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We value your time and stick to project schedules.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous quality control at every project stage.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Focus",
    description: "Your satisfaction is our top priority.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Cutting-edge solutions and modern designs.",
  },
  {
    icon: ThumbsUp,
    title: "Experience",
    description: "Decades of industry expertise.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Why Choose Us</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover why clients trust Tigerkenn Homes for their real estate and
            construction needs.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4 rounded-lg border p-6"
            >
              <reason.icon className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 font-semibold">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
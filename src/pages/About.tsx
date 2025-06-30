import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Award, Heart } from "lucide-react";
import arun from "../public/arun.jpg";
import maaz from "../public/maaz.jpg";
import unum from "../public/unum.jpg";

const About: React.FC = () => {
  const team = [
    {
      name: "Unum Sarfraz",
      role: "Engineering Manager at Aruba Networks (HPE)",
      image: unum,
      linkedIn: "https://www.linkedin.com/in/unumsarfraz/",
    },
    {
      name: "Arunesh Mishra",
      role: "AI Engineer, Senior Software Engineer at Google",
      image: arun,
      linkedIn: "https://www.linkedin.com/in/aruneshm/",
    },
    {
      name: "Mian Maaz Ullah Khan",
      role: "AI Engineer at Car Buddy Chat",
      image: maaz,
      linkedIn: "https://www.linkedin.com/in/mmaazukhan/",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description:
        "We push the boundaries of what's possible with AI and video technology to create breakthrough solutions.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "Every decision we make is guided by our users' needs and the value we can provide to their workflows.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We maintain the highest standards in everything we do, from code quality to customer support.",
    },
    {
      icon: Heart,
      title: "Transparency",
      description:
        "We believe in open communication, honest feedback, and building trust with our community.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold text-foreground sm:text-6xl mb-6">
              About VideoIndex
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              We're on a mission to make video content as searchable and
              accessible as text, empowering organizations to unlock the full
              potential of their video libraries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VideoIndex was born out of frustration with the inefficiency
                  of searching through video content. Our founders, both AI
                  researchers and engineers, experienced firsthand the challenge
                  of finding specific information buried in hours of recorded
                  meetings, training videos, and educational content.
                </p>
                <p>
                  In 2025, we set out to solve this problem by combining
                  advanced AI technologies with intuitive user interfaces. Our
                  goal was simple: make video content as searchable and
                  interactive as reading a document.
                </p>
                <p>
                  We are aiming to helps thousands of organizations transform
                  their video libraries into intelligent, searchable knowledge
                  bases that save time and unlock valuable insights for them.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team working together"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              The talented people behind VideoIndex
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <a
                  href={member.linkedIn}
                  className="relative mb-4 mx-auto overflow-hidden rounded-full"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className=" w-72 h-72 transition-transform group-hover:scale-110"
                  />
                </a>
                <a
                  href={member.linkedIn}
                  className="text-lg font-semibold text-foreground mb-1"
                >
                  {member.name}
                </a>
                <p className="text-sm text-primary font-medium mb-3">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
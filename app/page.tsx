"use client";
import { Post } from "@/models/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AlertMessage from "@/components/ui/AlertMessage";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Apple as WhatsApp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Key } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypeAnimation } from "react-type-animation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Post | null>(null);
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const [properties, setProperties] = useState<Post[]>([]);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAmharic, setShowAmharic] = useState(true);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAmharic((prev) => !prev);
    }, 8000); // Switch every 8 seconds (adjust as needed)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);

      // Update active section based on scroll position
      const sections = ["home", "properties", "contact", "about"] as const;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data);
    };

    fetchData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formData.email === "" && formData.phone === "") {
      setError("Please enter your email or phone number.");
      setTimeout(() => setError(""), 5000);
    } else {
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setError("");
          setSuccess(true);
          setFormData({ name: "", email: "", phone: "", message: "" });
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(data.message);
          setTimeout(() => setError(""), 5000);
        }
      } catch (error) {
        setError("Something went wrong. Please try again later.");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Floating Contact Buttons */}
      <div className="fixed right-4 bottom-20 z-50 space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <Link
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full shadow-lg transition-colors"
            aria-label="Contact us on WhatsApp"
          >
            <Image
              src="/assets/whatsapp.svg"
              width={52}
              height={52}
              className="text-white"
              alt="WhatsApp"
            />
          </Link>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <button
            onClick={() =>
              (window.location.href = `tel:${phoneNumber?.replace(/\s/g, "")}`)
            }
            className="flex items-center justify-center w-16 h-16 bg-[#89ca28] rounded-full shadow-lg hover:bg-[#78b122] transition-colors"
            aria-label="Call us"
          >
            <Phone className="w-8 h-8 text-white" />
          </button>
        </motion.div>
      </div>

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-[#89ca28]">
              Temer Real Estate
            </div>
            <div className="hidden md:flex space-x-8">
              {(["home", "properties", "contact", "about"] as const).map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-lg font-medium transition-colors ${
                      activeSection === section
                        ? "text-[#89ca28]"
                        : "text-gray-600 hover:text-[#89ca28]"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-[90vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
          alt="Modern building"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Text Switching */}
            <div className="min-h-[200px] md:min-h-[250px]">
              <AnimatePresence mode="wait">
                {showAmharic ? (
                  <motion.div
                    key="amharic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TypeAnimation
                      sequence={["የህልም ቤትዎን ያግኙ", 3000, ""]}
                      wrapper="h1"
                      speed={50}
                      repeat={Infinity}
                      className="text-5xl md:text-7xl font-bold text-white mb-6"
                    />
                    <TypeAnimation
                      sequence={[
                        "ከእርስዎ የአኗኗር ዘይቤ ጋር የሚዛመዱ ልዩ ንብረቶችን ያግኙ። ወደ ፍጹም ቤት ጉዞዎ እዚህ ይጀምራል።",
                        3000,
                        "",
                      ]}
                      wrapper="p"
                      speed={40}
                      repeat={Infinity}
                      className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="english"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TypeAnimation
                      sequence={["Find Your Dream Home", 3000, ""]}
                      wrapper="h1"
                      speed={50}
                      repeat={Infinity}
                      className="text-5xl md:text-7xl font-bold text-white mb-6"
                    />
                    <TypeAnimation
                      sequence={[
                        "Discover exceptional properties that match your lifestyle. Your journey to the perfect home starts here.",
                        3000,
                        "",
                      ]}
                      wrapper="p"
                      speed={40}
                      repeat={Infinity}
                      className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone number and Button container */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex items-center gap-2 mb-2"
              >
                <Phone className="h-8 w-8 text-white" />
                <span className="text-white text-3xl md:text-4xl font-bold tracking-wide">
                  {phoneNumber}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="lg"
                  className="bg-[#89ca28] hover:bg-[#78b122] text-white text-xl py-6 px-8"
                  onClick={() => scrollToSection("properties")}
                >
                  Explore Properties
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Featured Properties */}
      <section id="properties" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Featured Properties
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative h-64">
                  <Image
                    src={property.coverImage}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600">{property.shortDescription}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Dialog */}
      <Dialog
        open={!!selectedProperty}
        onOpenChange={() => setSelectedProperty(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {selectedProperty?.video && (
              <div className="aspect-video">
                <video controls className="w-full h-full rounded-lg">
                  <source src={selectedProperty.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {selectedProperty?.additionalImages.map(
                (
                  image: string | StaticImport,
                  index: Key | null | undefined
                ) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`${selectedProperty.title} - Image ${
                        index ? index : 0 + 1
                      }`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )
              )}
            </div>
            <p className="text-gray-600">
              {selectedProperty?.shortDescription}
            </p>
            {selectedProperty?.detailDescription && (
              <p className="text-gray-600">
                {selectedProperty?.detailDescription}
              </p>
            )}

            {/* Contact CTA Section */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Interested in this property?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Contact our sales team for more information or to schedule a
                    viewing.
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#89ca28]" />
                    <a
                      href={`tel:${phoneNumber?.replace(/\s/g, "")}`}
                      className="text-lg font-medium hover:text-[#89ca28]"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <WhatsApp className="w-5 h-5 text-[#89ca28]" /> */}
                    <Image
                      src="/assets/whatsapp.svg"
                      width={24}
                      height={24}
                      className="text-white"
                      alt="whatsapp icon"
                    />
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=I'm interested in ${selectedProperty?.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium hover:text-[#89ca28]"
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-[#89ca28] hover:bg-[#78b122] text-white"
                    onClick={() => {
                      setSelectedProperty(null);
                      scrollToSection("contact");
                    }}
                  >
                    Contact Us Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `tel:${phoneNumber?.replace(
                        /\s/g,
                        ""
                      )}`)
                    }
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Form */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Contact Us
          </motion.h2>
          <div className="max-w-2xl mx-auto">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Input
                name="name"
                placeholder="Your Name"
                onChange={handleInputChange}
                value={formData.name}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleInputChange}
                value={formData.email}
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                onChange={handleInputChange}
                value={formData.phone}
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                className="min-h-[150px]"
                onChange={handleInputChange}
                value={formData.message}
              />
              {success && (
                <AlertMessage
                  type="success"
                  message="We recive your message. We will contact you as soon as
                    possible."
                />
              )}
              {error.length > 0 && (
                <AlertMessage type="error" message={error} />
              )}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#89ca28] hover:bg-[#78b122] text-white text-lg"
              >
                Send Message
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4">Experience</h3>
              <p className="text-gray-600">
                With over 20 years in real estate, we bring unmatched expertise
                to every transaction.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4">
                Personalized Service
              </h3>
              <p className="text-gray-600">
                We understand that every client is unique, and we tailor our
                approach to meet your specific needs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4">Market Knowledge</h3>
              <p className="text-gray-600">
                Our deep understanding of local markets ensures you get the best
                value for your investment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer with Location and Contact */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold mb-4">Our Location</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-[#89ca28] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg">Ethiopia, Addis Ababa</p>
                  <p className="text-gray-400">
                    {process.env.NEXT_PUBLIC_ADDRESS1}
                  </p>
                  <p className="text-gray-400">
                    {process.env.NEXT_PUBLIC_ADDRESS2}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-[#89ca28]" />
                  <p className="text-lg">{phoneNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="/assets/whatsapp.svg"
                    width={24}
                    height={24}
                    className="text-white"
                    alt="whatsapp"
                  />
                  <p className="text-lg">{phoneNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-[#89ca28]" />
                  <p className="text-lg">{process.env.NEXT_PUBLIC_EMAIL}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Admin Link */}
      {/* <div className="fixed bottom-4 right-4">
        <Link href="/ermiadmin">
          <Button variant="outline" size="sm">
            <Building2 className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div> */}
    </main>
  );
}

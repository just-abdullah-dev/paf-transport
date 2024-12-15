"use client";

import { useState } from "react";
import Button from "@/components/utils/Button";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/utils/Toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/v1/mail/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.success) {
        setSubmitStatus("success");
        toast.success(data?.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container mx-auto max-w-7xl px-8 xl:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-12 text-primary">
          Get in Touch
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary">
              Contact Information
            </h3>
            <div className="space-y-4">
              <Link
                target="_blank"
                href={"tel:+921234567890"}
                className="flex items-center text-ternary"
              >
                <Phone className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                +92 123 456 7890
              </Link>
              <Link
                target="_blank"
                href={"mailto:info@paf-iast.edu.pk"}
                className="flex items-center text-ternary"
              >
                <Mail className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                info@paf-iast.edu.pk
              </Link>
              <Link
                target="_blank"
                href={"https://maps.app.goo.gl/zdXnPDWVNJCCyNhG7"}
                className="flex items-center text-ternary"
              >
                <MapPin className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                PAF-IAST, Mang, Haripur, Pakistan
              </Link>
            </div>
            <div className="mt-16">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary">
                Office Hours
              </h3>
              <p className="text-ternary">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-ternary">Saturday - Sunday: Closed</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">
              Send us a Message
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-ternary"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block inputTag w-full"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ternary"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block inputTag w-full"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-ternary"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-1 block inputTag w-full"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-ternary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block inputTag w-full"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {submitStatus === "success" && (
                <p className="text-green-600 text-sm mt-2">
                  Message sent successfully!
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-sm mt-2">
                  Error sending message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

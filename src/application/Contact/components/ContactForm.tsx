import React, { type FormEvent } from "react";

const ContactFormSection: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: handle form submit
    console.log("Form submitted");
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1f1f1f]">
            Contact Us
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#555555]">
            We love to hear from our customers, so please feel free to contact us
            with any feedback or questions.
          </p>
        </div>

        {/* Content: form + image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-7 border border-[#f2e9e3]"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#262626] mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full h-11 rounded-xl border border-black bg-gray-50 px-3.5 text-sm text-[#333] placeholder:text-[#b8ada2] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#262626] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full h-11 rounded-xl border border-black bg-gray-50 px-3.5 text-sm text-[#333] placeholder:text-[#b8ada2] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#262626] mb-1.5">
                Your message
              </label>
              <textarea
                rows={4}
                placeholder="Write here..."
                className="w-full rounded-2xl border border-black bg-gray-50 px-3.5 py-3 text-sm text-[#333] placeholder:text-[#b8ada2] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
            >
              Submit
            </button>
          </form>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full md:w-[600px] h-[420px] bg-gray-200 rounded-3xl overflow-hidden">
              {/* Replace src with your real image */}
              <img
                src="/images/contact-side.jpg"
                alt="Contact illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;

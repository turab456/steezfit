import React, { useState } from "react";
import Contactus from "../../../assets/contact_us.png";
import { useForm, ValidationError } from '@formspree/react';
import { CustomModal } from "../../../components/custom";

const ContactFormSection: React.FC = () => {
  const [state, handleSubmit] = useForm("xgvbrqvy");
  const [successModal, setSuccessModal] = useState(false);

  // When form is successfully submitted, open modal
  React.useEffect(() => {
    if (state.succeeded) {
      setSuccessModal(true);
    }
  }, [state.succeeded]);

  return (
    <section className="w-full bg-white py-12 md:py-16">
      {/* Success Modal */}
      <CustomModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        size="sm"
      >
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold text-[#1f1f1f]">
            Message Sent 🎉
          </h2>
          <p className="text-sm text-[#555] mt-2">
            Thank you for reaching out. Our team will get back to you soon.
          </p>

          <button
            onClick={() => setSuccessModal(false)}
            className="mt-5 w-full h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
          >
            Close
          </button>
        </div>
      </CustomModal>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1f1f1f]">
            Contact Us
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#555555]">
            For any questions, order issues, sizing doubts, or collaboration enquiries, use the form below to reach us.
            Whether you’re checking on a delivery, want to know more about our fabrics and fits, or are interested in
            working with AESTHCO, our team will review your message and respond as soon as possible.
          </p>
        </div>

        {/* Content */}
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
                id="name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                className="w-full h-11 rounded-xl border border-black bg-gray-50 px-3.5 text-sm text-[#333] placeholder:text-[#b8ada2] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#262626] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="w-full h-11 rounded-xl border border-black bg-gray-50 px-3.5 text-sm text-[#333] placeholder:text-[#b8ada2] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#262626] mb-1.5">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Write here..."
                className="w-full rounded-2xl border border-black bg-gray-50 px-3.5 py-3 text-sm text-[#333] placeholder:text-[#b8ada2] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            {/* Button with loader */}
            <button
              type="submit"
              disabled={state.submitting}
              className="w-full h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors flex items-center justify-center"
            >
              {state.submitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full md:w-[600px] h-[420px] bg-gray-200 rounded-3xl overflow-hidden">
              <img
                src={Contactus}
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

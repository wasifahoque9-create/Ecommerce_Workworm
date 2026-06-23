"use client";

export default function ContactPage() {
  return (
    <section className="bg-gradient-to-br from-[#121358] via-[#16186d] to-[#0d1045] py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-14 lg:mb-20">

          <span className="inline-block bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-[#F59E0B] uppercase tracking-[6px] text-base sm:text-lg font-bold px-6 py-2 rounded-full mb-6">
            Contact Us
          </span>

          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            We&apos;d Love To{" "}
            <span className="text-[#F59E0B]">Hear From You</span>
          </h2>

          <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Have questions about our products, services, or orders?
            Our team is always ready to help and answer your queries.
          </p>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 lg:mb-24">
          {[
            { icon: "🚚", title: "Fast Delivery",   desc: "Reliable and quick shipping for every order." },
            { icon: "🔒", title: "Secure Payments", desc: "Safe transactions with trusted payment gateways." },
            { icon: "💬", title: "24/7 Support",    desc: "Friendly customer support whenever you need help." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center
                         hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Centered Form ── */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">

            <h3 className="text-[#121358] text-2xl font-bold mb-6 text-center">
              Send Message
            </h3>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent
                           transition-shadow duration-200 text-sm sm:text-base"
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent
                           transition-shadow duration-200 text-sm sm:text-base"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent
                           transition-shadow duration-200 text-sm sm:text-base"
              />

              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent
                           transition-shadow duration-200 resize-none text-sm sm:text-base"
              />

              <button
                type="submit"
                className="w-full bg-[#F59E0B] hover:bg-amber-500 active:bg-amber-600 text-white font-semibold
                           py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2"
              >
                Send Message →
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
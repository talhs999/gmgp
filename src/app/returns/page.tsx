import { RefreshCcw, Camera, Ban, AlertCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-black pt-36 pb-20 md:pt-48 md:pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
          Returns & Refunds
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
          Our commitment to quality is absolute. Learn about our clear, straightforward policies for resolving any issues with your order.
        </p>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main Policy Alert */}
          <div className="bg-white border-l-4 border-accent p-6 rounded-r-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Due to the perishable nature of our premium meats, we maintain strict health, safety, and hygiene standards. 
              If there is a genuine issue with the product quality or an error on our part, we will make it right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Process */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-black text-lg uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <RefreshCcw className="text-accent" /> Resolution Process
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-sm">Contact Us Quickly</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      For missing items, contact us within <strong>48 hours</strong> of delivery. For exchange or return requests due to quality, you must notify us within <strong>7 days</strong>.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center font-black flex-shrink-0 text-accent"><Camera size={16} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Provide Evidence</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      For incorrect deliveries or quality concerns, you must include a clear photo of the items in your inquiry.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-sm">Resolution & Refund</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Once agreed upon, refunds are processed within 3-7 business days after item retrieval or verification.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Non Returnable */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-50 p-pointer-events-none">
                <Ban size={120} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-gray-100 pb-4 relative z-10">
                <AlertCircle className="text-red-500" /> Non-Returnable
              </h3>
              <p className="text-sm text-gray-600 mb-4 relative z-10">
                For health and safety reasons, we <strong>cannot</strong> accept returns or issue refunds under the following circumstances:
              </p>
              <ul className="space-y-3 relative z-10">
                {[
                  "Change of mind, personal reasons, or taste preferences.",
                  "Incorrect recipient address or phone number provided at checkout.",
                  "Items that have already been disposed of by the customer.",
                  "Any return attempted without prior agreement from our customer service.",
                  "Perishable items that were left unattended for excessive periods after delivery."
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <span className="text-red-500 mt-1 flex-shrink-0">•</span> 
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12 bg-gray-100 rounded-xl p-8">
            <h4 className="font-bold mb-2">Need to raise an issue?</h4>
            <p className="text-sm text-gray-500 mb-4">Our support team is available Monday to Saturday.</p>
            <div className="flex justify-center gap-4">
              <a href="mailto:retail@gmgp.com.au" className="btn-primary">Email Support</a>
              <a href="tel:0487500555" className="btn-outline bg-white">Call 0487 500 555</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

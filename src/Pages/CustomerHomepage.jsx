import React, { useState, useEffect } from "react";
import CustNavBar from "../Components/CustNavBar";

const advertisements = [
  {
    id: 1,
    image: "src/assets/ad1.jpg",
    title: "Super Fast Internet",
    description:
      "Experience lightning-fast internet speeds with our new fiber plans. Perfect for streaming, gaming, and working from home.",
  },
  {
    id: 2,
    image: "src/assets/ad2.jpg",
    title: "Unlimited Data Offer",
    description:
      "Enjoy unlimited data on all our broadband packages. No more worrying about data limits!",
  },
  {
    id: 3,
    image: "src/assets/ad3.jpg",
    title: "Special Discount",
    description:
      "Sign up today and get a 20% discount on your first 3 months. Limited time offer!",
  },
];

const SLIDE_INTERVAL = 4000;

const CustomerHome = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % advertisements.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => setCurrent(idx);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustNavBar />
      <div className="w-full flex-1 flex flex-col items-center p-0 m-0">
        <div className="w-full">
          {/* Make this container relative so dots can be absolutely positioned inside */}
          <div className="relative" style={{ height: 400 }}>
            {/* Slides */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                width: `${advertisements.length * 100}%`,
                transform: `translateX(-${
                  current * (100 / advertisements.length)
                }%)`,
              }}
            >
              {advertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="w-full flex-shrink-0 flex relative"
                  style={{ width: `${100 / advertisements.length}%` }}
                >
                  {/* Image section */}
                  <div className="w-full md:w-2/3 relative">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-[350px] object-cover rounded-l-lg border border-gray-200 shadow"
                      style={{ maxHeight: 400 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-l-lg pointer-events-none" />
                  </div>
                  {/* Description section */}
                  <div className="hidden md:flex flex-col justify-center w-1/3 bg-gradient-to-br from-blue-700 to-blue-400 rounded-r-lg px-10 py-8 border-t border-b border-r border-gray-200 shadow relative">
                    <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
                      {ad.title}
                    </h2>
                    <p className="text-base text-white font-medium drop-shadow">
                      {ad.description}
                    </p>
                  </div>
                  {/* Mobile overlay description */}
                  <div className="absolute bottom-0 left-0 w-full px-8 py-6 flex flex-col items-start bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded-b-lg md:hidden">
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">
                      {ad.title}
                    </h2>
                    <p className="text-base text-white font-medium drop-shadow">
                      {ad.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots inside the slider */}
                       <div className="absolute bottom-13 right-1 flex gap-2 z-30 px-4 py-2 rounded-full backdrop-blur-sm">
              {advertisements.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => goTo(dotIdx)}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                    current === dotIdx
                      ? "bg-blue-500 border-blue-500 scale-110"
                      : "bg-white border-blue-300 opacity-70"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;

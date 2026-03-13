import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatThisIs from "./components/WhatThisIs";
import HowItWorks from "./components/HowItWorks";
import UpcomingRace from "./components/UpcomingRace";
import GroupsSection from "./components/GroupsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <UpcomingRace />
      <WhatThisIs />
      <HowItWorks />
      <GroupsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;

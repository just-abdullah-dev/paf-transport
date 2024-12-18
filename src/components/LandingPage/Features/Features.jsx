import { Bus, CreditCard, QrCode, MapPin, FileText, Users } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Users className="w-12 h-12 text-secondary" />,
      title: "Student Registration",
      description:
        "Easily register and manage student profiles with our intuitive interface. Store essential information securely and efficiently.",
    },
    {
      icon: <Bus className="w-12 h-12 text-secondary" />,
      title: "Bus Route Assignment",
      description:
        "Dynamically assign students to optimal bus routes based on their location and schedule, maximizing efficiency and minimizing travel time.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-secondary" />,
      title: "Fee Payment Tracking",
      description:
        "Seamlessly track and manage transportation fee payments. Automated reminders and detailed payment history for each student.",
    },
    {
      icon: <QrCode className="w-12 h-12 text-secondary" />,
      title: "QR Code Generation",
      description:
        "Generate unique QR codes for each student, enabling quick and secure verification when boarding university buses.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-secondary" />,
      title: "Real-time Bus Tracking",
      v2: true,
      description:
        "Monitor bus locations in real-time, providing accurate ETAs and enhancing safety for students and peace of mind for parents.",
    },
    {
      icon: <FileText className="w-12 h-12 text-secondary" />,
      title: "Automated Reporting",
      v2: true,
      description:
        "Generate comprehensive reports on ridership, route efficiency, and financial data to inform decision-making and optimize operations.",
    },
  ];

  return (
    <section className="py-20" id="features">
      <div className="container mx-auto max-w-7xl px-8 xl:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white py-6 rounded-lg shadow-md relative"
            >
              {feature?.v2 && (
                <div className=" bg-custom-gradient p-2 absolute top-4 right-4">
                  v2
                </div>
              )}
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary text-center">
                {feature.title}
              </h3>
              <p className="text-[#292F36] text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

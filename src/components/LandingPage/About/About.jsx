import { CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <section className="py-20" id="about">
      <div className="container mx-auto max-w-7xl px-8 xl:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-12 text-primary">About Our System</h2>
        <div className="">
          <p className="text-sm md:text-lg mb-6 text-ternary">
            The PAF-IAST Transportation System is a state-of-the-art, comprehensive web-based application meticulously designed to revolutionize the management of student transportation within universities. Our system addresses the complex logistical challenges faced by educational institutions in organizing safe, efficient, and cost-effective transportation for their students.
          </p>
          <p className="text-sm md:text-lg mb-6 text-ternary">
            By leveraging cutting-edge technology, we empower university administrators to:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              "Efficiently register and manage student profiles",
              "Dynamically assign and optimize bus routes",
              "Track and process fee payments seamlessly",
              "Generate secure, unique QR codes for student identification",
              "Monitor real-time bus locations and schedules",
              "Generate comprehensive reports and analytics"
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                <span className="text-ternary text-sm md:text-lg">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm md:text-lg text-ternary">
            Our mission is to enhance the overall transportation experience for both students and administrators, ensuring a smooth, organized, and secure commute for everyone involved. By automating these critical processes, we aim to save time, reduce errors, and provide valuable insights that contribute to better decision-making and resource allocation.
          </p>
        </div>
      </div>
    </section>
  )
}


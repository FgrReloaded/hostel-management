import {
  Home,
  Droplets,
  Zap,
  Wifi,
  Stethoscope,
  ThermometerSunIcon,
  Leaf,
  UtensilsCrossed,
  Briefcase,
  Shield,
  Users
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Home,
      title: "Accommodation",
      description: "Comfortable and well-maintained living spaces for a pleasant stay.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Droplets,
      title: "RO Water",
      description: "Pure and safe drinking water available 24/7 through RO purification.",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600"
    },
    {
      icon: Zap,
      title: "24/7 Electricity",
      description: "Uninterrupted power supply with backup facilities.",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Wifi,
      title: "High-Speed Wi-Fi",
      description: "Stay connected with fast and reliable internet access.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Stethoscope,
      title: "Medical Facilities",
      description: "Quick access to medical care and first aid services.",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: ThermometerSunIcon,
      title: "Hot Water",
      description: "24/7 hot water availability for your comfort.",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: UtensilsCrossed,
      title: "Mess Services",
      description: "Nutritious and hygienic meals served daily.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Briefcase,
      title: "Private Utilities",
      description: "Personal amenities and storage facilities provided.",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance.",
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600"
    },
    {
      icon: Leaf,
      title: "Clean Environment",
      description: "Regular cleaning and maintenance of all facilities.",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      icon: Users,
      title: "Supportive Management",
      description: "Friendly staff available to assist you 24/7.",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Hostel Facilities
        </h2>
        <div className="flex items-center justify-center flex-wrap gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`${feature.bgColor} w-1/5 p-4 rounded-xl text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-3 ${feature.iconColor}`} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
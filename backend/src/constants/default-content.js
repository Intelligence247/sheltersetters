const defaultServices = [
  {
    title: "Aluminium Roofing",
    slug: "roofing",
    summary: "High-quality aluminium and composite roofing sheets production with superior durability",
    description:
      "Premium roofing systems engineered for Nigeria's climate, offering long-lasting protection and aesthetic appeal.",
    icon: "hammer",
    imageUrl: "/aluminium-roofing-sheets-product-showcase.jpg",
    order: 1,
  },
  {
    title: "Window Fabrication",
    slug: "windows",
    summary: "Custom sliding, casement windows and shopfront systems tailored to specifications",
    description:
      "Precision engineered aluminium windows and facade systems designed to enhance energy efficiency and security.",
    icon: "window",
    imageUrl: "/modern-window-glass-installation-design.jpg",
    order: 2,
  },
  {
    title: "Glass Partitioning",
    slug: "partitions",
    summary: "Modern office partitions and glass installations for contemporary workspaces",
    description:
      "Tailored glass solutions for corporate and residential projects, designed to maximise light and productivity.",
    icon: "panelRight",
    imageUrl: "/office-glass-partition-interior-design.jpg",
    order: 3,
  },
]

const defaultNews = [
  {
    headline: "New State-of-the-Art Fabrication Facility Opens",
    summary:
      "Shelter Setters inaugurates advanced production facility in Ilorin with cutting-edge machinery and equipment.",
    imageUrl: "/industrial-metal-fabrication-workshop-equipment.jpg",
    altText: "Shelter Setters engineers installing aluminium roofing, Ilorin.",
    publishedAt: new Date("2024-12-15"),
    isFeatured: true,
  },
  {
    headline: "Completed Premium Office Complex in Lagos",
    summary: "Successfully delivered glass partitioning and aluminium framework for a major corporate headquarters.",
    imageUrl: "/modern-interior-office-partitions-glass-design.jpg",
    altText: "Newly completed office complex with modern partitions.",
    publishedAt: new Date("2024-12-10"),
    isFeatured: true,
  },
]

const defaultProjects = [
  {
    title: "Premium Office Complex",
    slug: "premium-office-complex",
    summary: "Glass partitioning and aluminium framework for a corporate headquarters in Lagos.",
    description:
      "A comprehensive delivery of office partitions, facade systems, and custom aluminium fixtures for a Fortune 500 client.",
    category: "Commercial",
    location: "Lagos, Nigeria",
    imageUrl: "/modern-interior-office-partitions-glass-design.jpg",
    isFeatured: true,
  },
]

const defaultTeamMembers = [
  {
    name: "Dr. Hassan Ibrahim Sani",
    role: "MD/CEO",
    bio: "Over two decades leading high-performance aluminium production and construction teams across Nigeria.",
    imageUrl: "/team/dr-hassan-ibrahim-sani.jpg",
    order: 1,
  },
  {
    name: "Ariyo Ojo Tosin",
    role: "Human Resource Manager",
    bio: "Driving organisational excellence through talent development and operational leadership.",
    imageUrl: "/team/ariyo-ojo-tosin.jpg",
    order: 2,
  },
]

module.exports = {
  defaultServices,
  defaultNews,
  defaultProjects,
  defaultTeamMembers,
}


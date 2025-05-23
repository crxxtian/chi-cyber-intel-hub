
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Link as LinkIcon, 
  Download, 
  Search, 
  Filter,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

const resources = [
  {
    id: 1,
    title: "CISA Region 5 Office - Chicago",
    description: "Contact information and services provided by the Cybersecurity and Infrastructure Security Agency's Region 5 office, covering Illinois and surrounding states.",
    type: "link",
    link: "https://www.cisa.gov/about/regions/region-5",
    category: "Government"
  },
  {
    id: 2,
    title: "Illinois Data Breach Reporting Requirements",
    description: "Guidelines and legal requirements for reporting data breaches in Illinois, provided by the Illinois Attorney General's Office.",
    type: "link",
    link: "https://illinoisattorneygeneral.gov/consumer-protection/for-businesses/data-breach/",
    category: "Legal"
  },
  {
    id: 3,
    title: "Loyola University Chicago Cybersecurity Resources",
    description: "A compilation of cybersecurity resources including scholarship opportunities, competitions, conferences, and certifications.",
    type: "link",
    link: "https://www.luc.edu/ccpc/resources/",
    category: "Education"
  },
  {
    id: 4,
    title: "Illinois Department of Innovation & Technology Cybersecurity Resources",
    description: "Resources offered to the public and local governments to enhance cybersecurity awareness and practices.",
    type: "link",
    link: "https://doit.illinois.gov/initiatives/cybersecurity/resources.html",
    category: "Government"
  },
  {
    id: 5,
    title: "Chicago Cybersecurity Conference 2025",
    description: "Information about the upcoming Chicago Cybersecurity Conference, including dates, location, and registration details.",
    type: "link",
    link: "https://futureconevents.com/events/chicago-il-2025/",
    category: "Events"
  },
  {
    id: 6,
    title: "University of Chicago Cybersecurity Bootcamp",
    description: "Details about the University of Chicago's Cybersecurity Bootcamp, designed to launch careers in cybersecurity.",
    type: "link",
    link: "https://digitalskills.uchicago.edu/cybersecurity-bootcamp/",
    category: "Education"
  },
  {
    id: 7,
    title: "City of Chicago Information Security Policy",
    description: "The City of Chicago's official information security policies outlining minimum requirements and acceptable behaviors.",
    type: "link",
    link: "https://www.chicago.gov/city/en/depts/dti/supp_info/information-security-policy.html",
    category: "Government"
  },
  {
    id: 8,
    title: "THOTCON - Chicago's Hacking Conference",
    description: "Annual nonprofit hacker conference in Chicago, offering talks, workshops, and networking opportunities.",
    type: "link",
    link: "https://thotcon.org/",
    category: "Events"
  },
  {
    id: 9,
    title: "Illinois Emergency Management Agency - Office of Homeland Security",
    description: "Information on Illinois' homeland security initiatives aimed at creating a safer and more resilient state.",
    type: "link",
    link: "https://iemaohs.illinois.gov/hs.html",
    category: "Government"
  },
  {
    id: 10,
    title: "ChiCyberCon - Chicago's Premier Cybersecurity Education Conference",
    description: "Details about ChiCyberCon, focusing on AI, data, and human-centered cybersecurity.",
    type: "link",
    link: "https://chicybercon.com/",
    category: "Events"
  },
    {
      id: 11,
      title: "CISA Emergency Response - Cyber Incident Reporting",
      description: "Official channel for reporting cyber incidents and reaching federal CERT teams. For immediate assistance, contact CISA Central.",
      type: "link",
      link: "https://www.cisa.gov/report",
      category: "Incident Response"
    },
    {
      id: 12,
      title: "MS-ISAC (Multi-State Information Sharing & Analysis Center)",
      description: "Free cybersecurity resources and 24/7 incident response services for U.S. state, local, tribal, and territorial governments.",
      type: "link",
      link: "https://www.cisecurity.org/ms-isac",
      category: "Incident Response"
    },
    {
      id: 13,
      title: "NJCCIC - New Jersey Cybersecurity & Communications Integration Cell",
      description: "The NJCCIC provides real-time threat intelligence sharing and incident response support for New Jersey entities.",
      type: "link",
      link: "https://www.cyber.nj.gov/",
      category: "Incident Response"
    },
    {
      id: 14,
      title: "CERT Division - Carnegie Mellon University (SEI)",
      description: "The CERT Division at the SEI leads national R&D in cybersecurity, trusted by federal agencies and critical infrastructure partners.",
      type: "link",
      link: "https://www.sei.cmu.edu/about/divisions/cert/index.cfm",
      category: "Research"
    }
];


// Extract unique categories and types
const categories = Array.from(new Set(resources.map(resource => resource.category)));
const types = Array.from(new Set(resources.map(resource => resource.type)));

const getIconForResourceType = (type: string) => {
  switch (type) {
    case 'link':
      return <LinkIcon className="h-5 w-5 text-blue-500" />;
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'doc':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'xlsx':
      return <FileText className="h-5 w-5 text-green-600" />;
    default:
      return <Download className="h-5 w-5 text-purple-500" />;
  }
};

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);

  // Filter resources based on search query, category, and type
  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesType = !selectedType || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">Resources</h1>
        <p className="text-muted-foreground">
          Access valuable cybersecurity resources, tools, and documentation relevant to the Chicago area.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter menubar */}
        <Menubar className="border-none p-0 h-auto">
          <MenubarMenu>
            <MenubarTrigger className="font-normal h-10 px-4 py-2 rounded-md border">
              <Filter className="h-4 w-4 mr-2 text-orange-500" />
              Categories
            </MenubarTrigger>
            <MenubarContent align="start" className="min-w-[200px]">
              <MenubarItem
                onClick={() => setSelectedCategory(null)}
                className={!selectedCategory ? "bg-accent text-accent-foreground" : ""}
              >
                All Categories
              </MenubarItem>
              {categories.map(category => (
                <MenubarItem 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent text-accent-foreground" : ""}
                >
                  {category}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="font-normal h-10 px-4 py-2 rounded-md border ml-2">
              <FileText className="h-4 w-4 mr-2 text-purple-500" />
              Types
            </MenubarTrigger>
            <MenubarContent align="start">
              <MenubarItem
                onClick={() => setSelectedType(null)}
                className={!selectedType ? "bg-accent text-accent-foreground" : ""}
              >
                All Types
              </MenubarItem>
              {types.map(type => (
                <MenubarItem 
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type ? "bg-accent text-accent-foreground" : ""}
                >
                  <span className="flex items-center">
                    {getIconForResourceType(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </span>
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Resource cards with drawer preview */}
      <div className="space-y-6">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-md">
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <Drawer key={resource.id} open={isDrawerOpen && selectedResource?.id === resource.id} onOpenChange={(open) => {
              setIsDrawerOpen(open);
              if (!open) setSelectedResource(null);
            }}>
              <DrawerTrigger asChild>
                <div 
                  className="border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors cursor-pointer animate-in fade-in duration-300"
                  onClick={() => {
                    setSelectedResource(resource);
                    setIsDrawerOpen(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-secondary rounded-md">
                      {getIconForResourceType(resource.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-mono font-medium text-lg mb-1 group flex items-center">
                        {resource.title}
                        <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="uppercase text-xs font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded">
                          {resource.type}
                        </span>
                        <span className="uppercase text-xs font-medium bg-secondary px-2 py-0.5 rounded border">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerTrigger>
              
              <DrawerContent className="p-6">
                <DrawerHeader className="p-0">
                  <DrawerTitle className="text-2xl font-mono">{resource.title}</DrawerTitle>
                  <DrawerDescription className="text-base mt-2">{resource.description}</DrawerDescription>
                </DrawerHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span> 
                    <span className="flex items-center">
                      {getIconForResourceType(resource.type)} 
                      <span className="ml-2 capitalize">{resource.type}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span> 
                    <span>{resource.category}</span>
                  </div>
                  <Button asChild className="w-full sm:w-auto mt-4">
                    <Link to={resource.link} className="flex items-center gap-2">
                      {resource.type === 'link' ? 'Visit Resource' : 'Download Resource'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;

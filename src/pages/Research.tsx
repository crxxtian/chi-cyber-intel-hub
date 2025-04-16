"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HomeSection } from "@/components/HomeSection";
import Modal from "@/components/Modal";
import ReactMarkdown from "react-markdown";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url: string;
};

type ThreatActor = {
  title: string;
  content: string;
};

type ArxivPaper = {
  title: string;
  summary: string;
  link: string;
};

type CertTeam = {
  name: string;
  url: string;
};

type SectorStat = {
  sector: string;
  count: number;
};

export default function Research() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [certs, setCerts] = useState<CertTeam[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStat[]>([]);

  const modalContent: Record<string, ThreatActor> = {
    RansomHouse: {
      title: "RansomHouse",
      content: `**RansomHouse** is an extortion group known for stealing sensitive data without necessarily encrypting systems.

In March 2025, RansomHouse claimed responsibility for breaching **Loretto Hospital** in Chicago, stealing **1.5TB** of patient and administrative data.

### Key TTPs
- Double-extortion without ransomware deployment
- Data leak sites on darknet (.onion)

### IOCs
- File Extensions: \`.XVGV\`, \`.dump\`, \`.backup\`
- Ransom Notes: *HowToRestore.txt*
- Tools: Mimikatz, PowerShell discovery
- Leak site: \`xw7au5p...onion\``,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** is one of the most active RaaS (Ransomware-as-a-Service) operations globally.

It has targeted **CDW**, **Illinois state agencies**, and several logistics and manufacturing companies in the Midwest.

### Key TTPs
- RaaS model with LockBit 3.0 and custom builds
- Use of group policy tampering and self-delete flags

### IOCs
- Flags: \`-del\`, \`-gdel\`
- Registry: \`HKCU\\Control Panel\\Desktop\\WallPaper\`
- Mutex: \`Global<hash>\`
- File Drop Paths: \`ADMIN$\\Temp\\\`, \`%SystemRoot%\\Temp\\\``,
    },
  };

  useEffect(() => {
    fetch("/api/ransomware?type=recentvictims&country=US")
      .then((res) => res.json())
      .then((data) => setVictims(Array.isArray(data) ? data.slice(0, 30) : []))
      .catch((err) => console.error("Victim fetch failed", err));

    fetch("/api/ransomware?type=certs&country=US")
      .then((res) => res.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter((team: any) => typeof team.name === "string" && typeof team.url === "string")
          : [];
        setCerts(filtered.slice(0, 24));
      })
      .catch((err) => console.error("CERT fetch failed", err));

    fetch("/api/arxiv")
      .then((res) => res.json())
      .then((data) => {
        const valid = Array.isArray(data)
          ? data.filter((d) => d.title && d.summary && d.link)
          : [];
        setPapers(valid.slice(0, 8));
      })
      .catch((err) => console.error("arXiv fetch failed", err));

    fetch("https://api.ransomware.live/v2/sectors")
      .then((res) => res.json())
      .then((data) => {
        const sorted = Object.entries(data)
          .map(([sector, count]) => ({ sector, count: Number(count) }))
          .sort((a, b) => b.count - a.count);
        setSectorStats(sorted.slice(0, 10));
      })
      .catch((err) => console.error("Sector stats fetch failed", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims;

  const sectorChartData = {
    labels: sectorStats.map((s) => s.sector),
    datasets: [
      {
        label: "Victim Count",
        data: sectorStats.map((s) => s.count),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Investigating threat actors, ransomware campaigns, and ongoing breaches with a focus on Illinois, the Midwest, and North America.
        </p>
      </motion.div>

      <HomeSection title="Threat Actor Spotlights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(modalContent).map((actor) => (
            <div
              key={actor}
              className="border border-border p-4 rounded-md bg-muted/20 cursor-pointer"
              onClick={() => {
                setActorDetails(modalContent[actor]);
                setIsModalOpen(true);
              }}
            >
              <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                {modalContent[actor].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {modalContent[actor].content.split("\n")[0]}
              </p>
              <Badge variant="secondary">{actor === "RansomHouse" ? "Healthcare" : "Manufacturing"}</Badge>
            </div>
          ))}
        </div>
      </HomeSection>

      {papers.length > 0 && (
        <HomeSection title="Cybersecurity Research Papers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper, i) => (
              <div key={i} className="border border-border p-4 rounded-md bg-secondary/50 space-y-2">
                <h3 className="font-mono font-medium text-base">{paper.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-5">{paper.summary}</p>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-blue-500"
                >
                  Read full paper
                </a>
              </div>
            ))}
          </div>
        </HomeSection>
      )}

      {victims.length > 0 && (
        <HomeSection title="Recent Ransomware Activity">
          <div className="mb-4 flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  {sectorFilter || "Filter Sector"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSectorFilter(null)}>All Sectors</DropdownMenuItem>
                {uniqueSectors.map((sector) => (
                  <DropdownMenuItem key={sector} onClick={() => setSectorFilter(sector)}>
                    {sector}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            {filteredVictims.map((v) => (
              <div key={`${v.victim}-${v.attackdate}`} className="border border-border p-4 rounded-md bg-background/40">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-mono font-medium">{v.victim || "Unknown Victim"}</h3>
                  <Badge variant="outline">{v.group}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sector: <strong>{v.activity || "Unknown"}</strong> • {v.attackdate}
                </p>
                {v.claim_url && (
                  <a
                    href={v.claim_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline pt-1 block"
                  >
                    View breach record
                  </a>
                )}
              </div>
            ))}
          </div>
        </HomeSection>
      )}

      {sectorStats.length > 0 && (
        <HomeSection title="Top Targeted Sectors">
          <Bar data={sectorChartData} />
        </HomeSection>
      )}

      {actorDetails && (
        <Modal
          title={actorDetails.title}
          content={<ReactMarkdown>{actorDetails.content}</ReactMarkdown>}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

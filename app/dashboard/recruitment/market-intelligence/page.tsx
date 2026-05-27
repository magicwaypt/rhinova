"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  Download,
  RefreshCw,
  Globe,
  Zap,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Eye,
  Bell,
  Plus,
  Sparkles,
  Building,
  UserCheck,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

// Mock data for market intelligence
const competitorCompanies = [
  {
    id: "1",
    name: "TechCorp Global",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    headcount: 12500,
    headcountChange: 8.5,
    avgTenure: 2.8,
    glassdoorRating: 4.2,
    hiringVelocity: 145,
    topRoles: ["Senior Engineer", "Product Manager", "Data Scientist"],
    locations: ["San Francisco", "New York", "London"],
    recentNews: "Announced $500M Series E funding",
    talentFlow: { inbound: 234, outbound: 189 },
  },
  {
    id: "2",
    name: "InnovateTech",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    headcount: 8200,
    headcountChange: -2.3,
    avgTenure: 3.1,
    glassdoorRating: 3.8,
    hiringVelocity: 67,
    topRoles: ["Software Engineer", "DevOps", "ML Engineer"],
    locations: ["Austin", "Seattle", "Berlin"],
    recentNews: "Layoffs announced in Q1 2024",
    talentFlow: { inbound: 89, outbound: 156 },
  },
  {
    id: "3",
    name: "DataDriven Inc",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Data & Analytics",
    headcount: 5600,
    headcountChange: 15.2,
    avgTenure: 2.4,
    glassdoorRating: 4.5,
    hiringVelocity: 98,
    topRoles: ["Data Engineer", "Analytics Lead", "ML Researcher"],
    locations: ["Boston", "Chicago", "Toronto"],
    recentNews: "IPO planned for Q3 2024",
    talentFlow: { inbound: 178, outbound: 67 },
  },
  {
    id: "4",
    name: "CloudScale Systems",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Cloud Infrastructure",
    headcount: 15800,
    headcountChange: 5.1,
    avgTenure: 3.5,
    glassdoorRating: 4.0,
    hiringVelocity: 189,
    topRoles: ["Cloud Architect", "SRE", "Platform Engineer"],
    locations: ["Seattle", "Dublin", "Singapore"],
    recentNews: "Acquired startup for $200M",
    talentFlow: { inbound: 312, outbound: 245 },
  },
]

const marketTrends = [
  {
    skill: "Generative AI",
    demandChange: 340,
    avgSalary: 185000,
    salaryChange: 25,
    openRoles: 12500,
    topCompanies: ["OpenAI", "Anthropic", "Google", "Meta"],
  },
  {
    skill: "Rust Programming",
    demandChange: 156,
    avgSalary: 165000,
    salaryChange: 18,
    openRoles: 4200,
    topCompanies: ["Cloudflare", "Discord", "Dropbox"],
  },
  {
    skill: "Kubernetes",
    demandChange: 45,
    avgSalary: 155000,
    salaryChange: 8,
    openRoles: 18900,
    topCompanies: ["Google", "Red Hat", "VMware"],
  },
  {
    skill: "Product Management",
    demandChange: 22,
    avgSalary: 145000,
    salaryChange: 5,
    openRoles: 8700,
    topCompanies: ["Meta", "Stripe", "Airbnb"],
  },
]

const talentPoolInsights = [
  {
    region: "San Francisco Bay Area",
    totalTalent: 485000,
    availableTalent: 28500,
    avgSalary: 195000,
    competitionIndex: 9.2,
    topSkills: ["Python", "Machine Learning", "Cloud"],
  },
  {
    region: "New York Metro",
    totalTalent: 320000,
    availableTalent: 22000,
    avgSalary: 175000,
    competitionIndex: 8.5,
    topSkills: ["Finance Tech", "Data Science", "Full Stack"],
  },
  {
    region: "London, UK",
    totalTalent: 245000,
    availableTalent: 18500,
    avgSalary: 145000,
    competitionIndex: 7.8,
    topSkills: ["FinTech", "DevOps", "Security"],
  },
  {
    region: "Berlin, Germany",
    totalTalent: 125000,
    availableTalent: 12000,
    avgSalary: 95000,
    competitionIndex: 6.2,
    topSkills: ["Backend", "Mobile", "AI/ML"],
  },
]

const executiveMoves = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    previousRole: "VP Engineering",
    previousCompany: "Meta",
    newRole: "CTO",
    newCompany: "Stealth Startup",
    moveDate: "2024-01-15",
    linkedinFollowers: 45000,
  },
  {
    id: "2",
    name: "Michael Roberts",
    avatar: "/placeholder.svg?height=40&width=40",
    previousRole: "Chief Data Officer",
    previousCompany: "Netflix",
    newRole: "CEO",
    newCompany: "DataAI Labs",
    moveDate: "2024-01-10",
    linkedinFollowers: 78000,
  },
  {
    id: "3",
    name: "Jennifer Walsh",
    avatar: "/placeholder.svg?height=40&width=40",
    previousRole: "SVP Product",
    previousCompany: "Salesforce",
    newRole: "CPO",
    newCompany: "TechUnicorn",
    moveDate: "2024-01-08",
    linkedinFollowers: 32000,
  },
]

export default function MarketIntelligencePage() {
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState<string[]>(["1", "3"])

  const toggleWatchlist = (companyId: string) => {
    setWatchlist(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
          <p className="text-muted-foreground">
            Real-time insights on competitors, talent markets, and industry trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Set Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tracked Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+12</span> added this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Signals</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500">23 high priority</span> this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Executive Moves</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              In tracked companies (30 days)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Talent Flow Index</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.5%</div>
            <p className="text-xs text-muted-foreground">
              Net inbound to your industry
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="talent-pools">Talent Pools</TabsTrigger>
          <TabsTrigger value="executive-moves">Executive Moves</TabsTrigger>
        </TabsList>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>

          <div className="grid gap-4">
            {competitorCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Company Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={company.logo} />
                            <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{company.name}</h3>
                              <Badge variant="secondary">{company.industry}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {company.headcount.toLocaleString()} employees
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {company.glassdoorRating} Glassdoor
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={watchlist.includes(company.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleWatchlist(company.id)}
                        >
                          {watchlist.includes(company.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Watching
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Watch
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Headcount Change</p>
                          <p className={`text-lg font-semibold flex items-center gap-1 ${
                            company.headcountChange >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}>
                            {company.headcountChange >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {company.headcountChange >= 0 ? "+" : ""}{company.headcountChange}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg. Tenure</p>
                          <p className="text-lg font-semibold">{company.avgTenure} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hiring Velocity</p>
                          <p className="text-lg font-semibold">{company.hiringVelocity}/month</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Talent Flow</p>
                          <p className={`text-lg font-semibold ${
                            company.talentFlow.inbound > company.talentFlow.outbound 
                              ? "text-emerald-500" 
                              : "text-red-500"
                          }`}>
                            {company.talentFlow.inbound > company.talentFlow.outbound ? "+" : ""}
                            {company.talentFlow.inbound - company.talentFlow.outbound}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Top Hiring Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {company.topRoles.map((role) => (
                            <Badge key={role} variant="outline">{role}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Recent News</p>
                        <p className="text-sm mt-1">{company.recentNews}</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t lg:border-l lg:border-t-0 p-4 bg-muted/30 flex flex-row lg:flex-col gap-2 justify-center">
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        View Employees
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Full Report
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Target className="mr-2 h-4 w-4" />
                        Source Talent
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Trending Skills & Demand
              </CardTitle>
              <CardDescription>
                Real-time analysis of skill demand across the job market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {marketTrends.map((trend, index) => (
                  <div key={trend.skill} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-amber-500/20 text-amber-500" :
                          index === 1 ? "bg-slate-500/20 text-slate-500" :
                          index === 2 ? "bg-orange-500/20 text-orange-500" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{trend.skill}</h4>
                          <p className="text-xs text-muted-foreground">
                            {trend.openRoles.toLocaleString()} open positions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">${(trend.avgSalary / 1000).toFixed(0)}k avg</p>
                          <p className="text-xs text-emerald-500">+{trend.salaryChange}% YoY</p>
                        </div>
                        <Badge variant={trend.demandChange > 100 ? "default" : "secondary"}>
                          <TrendingUp className="mr-1 h-3 w-3" />
                          +{trend.demandChange}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min(trend.demandChange / 4, 100)} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Top Employers:</span>
                      {trend.topCompanies.map((company, i) => (
                        <span key={company}>
                          {company}{i < trend.topCompanies.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Trends by Role</CardTitle>
                <CardDescription>Market rate changes over 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: "AI/ML Engineer", salary: 195000, change: 18 },
                    { role: "Staff Engineer", salary: 220000, change: 12 },
                    { role: "Engineering Manager", salary: 185000, change: 8 },
                    { role: "Product Manager", salary: 165000, change: 5 },
                    { role: "DevOps Engineer", salary: 155000, change: 10 },
                  ].map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <span className="text-sm">{item.role}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">${(item.salary / 1000).toFixed(0)}k</span>
                        <Badge variant="outline" className="text-emerald-500">
                          +{item.change}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Hiring Activity</CardTitle>
                <CardDescription>Job postings by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { industry: "Technology", postings: 45000, change: 15 },
                    { industry: "FinTech", postings: 18000, change: 22 },
                    { industry: "Healthcare Tech", postings: 12000, change: 35 },
                    { industry: "E-commerce", postings: 8500, change: -5 },
                    { industry: "Gaming", postings: 6200, change: 8 },
                  ].map((item) => (
                    <div key={item.industry} className="flex items-center justify-between">
                      <span className="text-sm">{item.industry}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{(item.postings / 1000).toFixed(1)}k</span>
                        <Badge 
                          variant="outline" 
                          className={item.change >= 0 ? "text-emerald-500" : "text-red-500"}
                        >
                          {item.change >= 0 ? "+" : ""}{item.change}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Talent Pools Tab */}
        <TabsContent value="talent-pools" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {talentPoolInsights.map((pool) => (
              <Card key={pool.region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {pool.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Tech Talent</p>
                      <p className="text-xl font-bold">{(pool.totalTalent / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available (Active/Passive)</p>
                      <p className="text-xl font-bold">{(pool.availableTalent / 1000).toFixed(1)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Base Salary</p>
                      <p className="text-xl font-bold">${(pool.avgSalary / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Competition Index</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold">{pool.competitionIndex}</p>
                        <Badge variant={pool.competitionIndex > 8 ? "destructive" : pool.competitionIndex > 6 ? "secondary" : "default"}>
                          {pool.competitionIndex > 8 ? "High" : pool.competitionIndex > 6 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Top Skills in Region</p>
                    <div className="flex flex-wrap gap-2">
                      {pool.topSkills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Target className="mr-2 h-4 w-4" />
                    Source from this Region
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Executive Moves Tab */}
        <TabsContent value="executive-moves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executive Movements</CardTitle>
              <CardDescription>
                Track leadership changes at competitor and target companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executiveMoves.map((exec) => (
                  <div key={exec.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={exec.avatar} />
                      <AvatarFallback>{exec.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{exec.name}</h4>
                        <Badge variant="secondary">{exec.linkedinFollowers.toLocaleString()} followers</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-muted-foreground">{exec.previousRole}</span>
                        <span className="text-muted-foreground">@</span>
                        <span>{exec.previousCompany}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-primary font-medium">{exec.newRole}</span>
                        <span className="text-muted-foreground">@</span>
                        <span className="font-medium">{exec.newCompany}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Moved on {new Date(exec.moveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button size="sm">
                        <Target className="mr-2 h-4 w-4" />
                        Reach Out
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Departure Alerts
              </CardTitle>
              <CardDescription>
                Key personnel showing signs of potential departure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Alex Thompson", role: "VP Engineering", company: "TechCorp", signal: "LinkedIn activity spike", risk: "High" },
                  { name: "Maria Garcia", role: "Head of Product", company: "InnovateTech", signal: "Profile updates", risk: "Medium" },
                  { name: "David Kim", role: "CTO", company: "DataDriven", signal: "Conference speaking", risk: "Low" },
                ].map((alert) => (
                  <div key={alert.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.role} at {alert.company}</p>
                      <p className="text-xs text-muted-foreground">Signal: {alert.signal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        alert.risk === "High" ? "destructive" : 
                        alert.risk === "Medium" ? "secondary" : "outline"
                      }>
                        {alert.risk} Risk
                      </Badge>
                      <Button size="sm">Contact</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

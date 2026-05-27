"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Radar,
  Brain,
  Globe,
  Database,
  Mail,
  Building2,
  PieChart,
  ArrowRight,
  Users,
  Zap,
  TrendingUp,
  Target,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot,
} from "lucide-react"

const aiModules = [
  {
    title: "AI Sourcing Copilot",
    description: "Autonomous talent discovery across LinkedIn, GitHub, and 50+ sources with AI-powered matching.",
    href: "/dashboard/recruitment/sourcing",
    icon: Radar,
    stats: { label: "Candidates Found", value: "2,847", trend: "+23%" },
    status: "active",
    features: ["Multi-source scanning", "AI matching", "Auto-enrichment"],
  },
  {
    title: "Candidate Intelligence",
    description: "Deep-dive profiles with skill validation, career trajectory analysis, and fit scoring.",
    href: "/dashboard/recruitment/candidate-intelligence",
    icon: Brain,
    stats: { label: "Profiles Analyzed", value: "1,234", trend: "+18%" },
    status: "active",
    features: ["360 profiles", "Skill validation", "Culture fit"],
  },
  {
    title: "Semantic Talent Search",
    description: "Natural language search with AI understanding of skills, experience, and potential.",
    href: "/dashboard/recruitment/semantic-search",
    icon: Globe,
    stats: { label: "Searches Today", value: "156", trend: "+12%" },
    status: "active",
    features: ["NLP queries", "Smart filters", "Saved searches"],
  },
  {
    title: "Talent Intelligence DB",
    description: "Unified talent pool with automatic updates, engagement tracking, and pipeline management.",
    href: "/dashboard/recruitment/talent-database",
    icon: Database,
    stats: { label: "Talent Pool", value: "45,678", trend: "+8%" },
    status: "active",
    features: ["Auto-enrichment", "Engagement tracking", "Tags & lists"],
  },
  {
    title: "AI Outreach Assistant",
    description: "Personalized multi-channel campaigns with AI-generated messaging and optimal timing.",
    href: "/dashboard/recruitment/outreach",
    icon: Mail,
    stats: { label: "Response Rate", value: "34%", trend: "+15%" },
    status: "active",
    features: ["Personalization", "Multi-channel", "A/B testing"],
  },
  {
    title: "Market Intelligence",
    description: "Competitor analysis, salary benchmarks, and talent market trends in real-time.",
    href: "/dashboard/recruitment/market-intelligence",
    icon: Building2,
    stats: { label: "Companies Tracked", value: "156", trend: "+5%" },
    status: "active",
    features: ["Competitor intel", "Salary data", "Market trends"],
  },
  {
    title: "Recruitment Analytics",
    description: "Comprehensive metrics, AI insights, and performance optimization recommendations.",
    href: "/dashboard/recruitment/analytics",
    icon: PieChart,
    stats: { label: "Time-to-Hire", value: "28 days", trend: "-12%" },
    status: "active",
    features: ["KPI tracking", "AI insights", "ROI analysis"],
  },
]

const quickStats = [
  { label: "Active Jobs", value: 34, icon: Target },
  { label: "Total Candidates", value: 1247, icon: Users },
  { label: "AI Actions Today", value: 892, icon: Bot },
  { label: "Interviews Scheduled", value: 23, icon: Clock },
]

const recentActivity = [
  {
    type: "sourcing",
    message: "AI found 45 matching candidates for Senior Engineer role",
    time: "2 min ago",
    status: "success",
  },
  {
    type: "outreach",
    message: "Campaign 'Q1 Engineering' achieved 38% response rate",
    time: "15 min ago",
    status: "success",
  },
  {
    type: "alert",
    message: "3 high-value candidates showing departure signals",
    time: "1 hour ago",
    status: "warning",
  },
  {
    type: "intelligence",
    message: "Competitor TechCorp increased engineering headcount by 15%",
    time: "2 hours ago",
    status: "info",
  },
]

export default function RecruitmentOverviewPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Talent Intelligence</h1>
          <p className="text-muted-foreground">
            End-to-end AI-powered recruitment platform for modern talent acquisition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI Active
          </Badge>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Quick Source
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Recruitment Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiModules.map((module) => (
            <Card key={module.title} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <module.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
                    Active
                  </Badge>
                </div>
                <CardTitle className="mt-3">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">{module.stats.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{module.stats.value}</span>
                    <Badge variant="secondary" className="text-emerald-500">
                      {module.stats.trend}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {module.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Link href={module.href}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Open Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & AI Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Recent AI Activity
            </CardTitle>
            <CardDescription>Latest actions from your AI recruitment agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`mt-0.5 p-1 rounded-full ${
                    activity.status === "success" ? "bg-emerald-500/20 text-emerald-500" :
                    activity.status === "warning" ? "bg-amber-500/20 text-amber-500" :
                    "bg-blue-500/20 text-blue-500"
                  }`}>
                    {activity.status === "success" && <CheckCircle2 className="h-4 w-4" />}
                    {activity.status === "warning" && <AlertCircle className="h-4 w-4" />}
                    {activity.status === "info" && <TrendingUp className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Performance Summary
            </CardTitle>
            <CardDescription>How AI is improving your recruitment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sourcing Efficiency</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Candidate Match Accuracy</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Outreach Response Rate</span>
                <span className="font-medium">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Time Saved vs Manual</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">AI Impact This Month</p>
              <p className="text-2xl font-bold text-primary mt-1">847 hours saved</p>
              <p className="text-xs text-muted-foreground mt-1">Equivalent to 4.2 FTE recruiters</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

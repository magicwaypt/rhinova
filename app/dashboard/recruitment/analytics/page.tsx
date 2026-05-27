"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Target,
  Zap,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  PieChart,
  LineChart,
} from "lucide-react"

// Analytics data
const kpiMetrics = {
  timeToHire: { value: 28, change: -12, unit: "days", target: 30 },
  costPerHire: { value: 4250, change: -8, unit: "$", target: 5000 },
  qualityOfHire: { value: 87, change: 5, unit: "%", target: 85 },
  offerAcceptance: { value: 82, change: 3, unit: "%", target: 80 },
  sourceEfficiency: { value: 34, change: 15, unit: "%", target: 30 },
  candidateNPS: { value: 72, change: 8, unit: "", target: 70 },
}

const pipelineMetrics = {
  totalCandidates: 1247,
  activeJobs: 34,
  interviewsScheduled: 89,
  offersExtended: 12,
  stages: [
    { name: "Applied", count: 456, conversionRate: 100 },
    { name: "Screened", count: 234, conversionRate: 51 },
    { name: "Phone Interview", count: 156, conversionRate: 67 },
    { name: "Technical", count: 89, conversionRate: 57 },
    { name: "Onsite", count: 45, conversionRate: 51 },
    { name: "Offer", count: 28, conversionRate: 62 },
    { name: "Hired", count: 18, conversionRate: 64 },
  ]
}

const sourcePerformance = [
  { source: "LinkedIn Recruiter", hires: 45, applications: 320, cost: 85000, quality: 88, timeToHire: 24 },
  { source: "Employee Referrals", hires: 38, applications: 89, cost: 15200, quality: 92, timeToHire: 18 },
  { source: "AI Sourcing", hires: 28, applications: 156, cost: 12000, quality: 85, timeToHire: 22 },
  { source: "Job Boards", hires: 22, applications: 890, cost: 45000, quality: 78, timeToHire: 32 },
  { source: "Career Site", hires: 18, applications: 567, cost: 8000, quality: 82, timeToHire: 28 },
  { source: "Agencies", hires: 12, applications: 45, cost: 72000, quality: 86, timeToHire: 35 },
]

const recruiterPerformance = [
  { name: "Sarah Johnson", hires: 15, interviews: 45, offers: 18, acceptanceRate: 83, avgTimeToHire: 22, rating: 4.8 },
  { name: "Michael Chen", hires: 12, interviews: 38, offers: 14, acceptanceRate: 86, avgTimeToHire: 25, rating: 4.6 },
  { name: "Emily Davis", hires: 10, interviews: 32, offers: 12, acceptanceRate: 83, avgTimeToHire: 28, rating: 4.5 },
  { name: "James Wilson", hires: 8, interviews: 28, offers: 10, acceptanceRate: 80, avgTimeToHire: 30, rating: 4.3 },
]

const departmentMetrics = [
  { department: "Engineering", openRoles: 18, hires: 12, avgTime: 32, budget: 250000, spent: 180000 },
  { department: "Product", openRoles: 8, hires: 5, avgTime: 28, budget: 120000, spent: 85000 },
  { department: "Design", openRoles: 5, hires: 4, avgTime: 24, budget: 80000, spent: 62000 },
  { department: "Sales", openRoles: 12, hires: 8, avgTime: 18, budget: 150000, spent: 95000 },
  { department: "Marketing", openRoles: 4, hires: 3, avgTime: 22, budget: 60000, spent: 42000 },
]

const aiInsights = [
  {
    type: "optimization",
    title: "Reduce Time-to-Hire by 20%",
    description: "AI analysis suggests streamlining the technical interview process could save 5-7 days on average.",
    impact: "High",
    action: "Review Interview Process",
  },
  {
    type: "alert",
    title: "Engineering Pipeline Risk",
    description: "Senior Backend Engineer role has been open 45+ days with declining candidate quality scores.",
    impact: "Critical",
    action: "Expand Sourcing",
  },
  {
    type: "success",
    title: "Referral Program Performing Well",
    description: "Employee referrals show 42% higher quality scores and 30% faster time-to-hire vs other sources.",
    impact: "Positive",
    action: "Increase Referral Bonus",
  },
  {
    type: "optimization",
    title: "Diversify Sourcing Channels",
    description: "Over-reliance on LinkedIn (65% of hires). Consider GitHub, Stack Overflow for technical roles.",
    impact: "Medium",
    action: "Add New Sources",
  },
]

export default function RecruitmentAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [department, setDepartment] = useState("all")

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics, insights, and AI-powered recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.timeToHire.value} days</div>
            <div className="flex items-center justify-between mt-1">
              <p className={`text-xs flex items-center ${kpiMetrics.timeToHire.change < 0 ? "text-emerald-500" : "text-red-500"}`}>
                {kpiMetrics.timeToHire.change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(kpiMetrics.timeToHire.change)}%
              </p>
              <Badge variant="outline" className="text-xs">Target: {kpiMetrics.timeToHire.target}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${kpiMetrics.costPerHire.value.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-1">
              <p className={`text-xs flex items-center ${kpiMetrics.costPerHire.change < 0 ? "text-emerald-500" : "text-red-500"}`}>
                {kpiMetrics.costPerHire.change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(kpiMetrics.costPerHire.change)}%
              </p>
              <Badge variant="outline" className="text-xs">Target: ${kpiMetrics.costPerHire.target.toLocaleString()}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quality of Hire</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.qualityOfHire.value}%</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs flex items-center text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpiMetrics.qualityOfHire.change}%
              </p>
              <Badge variant="outline" className="text-xs">Target: {kpiMetrics.qualityOfHire.target}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offer Acceptance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.offerAcceptance.value}%</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs flex items-center text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpiMetrics.offerAcceptance.change}%
              </p>
              <Badge variant="outline" className="text-xs">Target: {kpiMetrics.offerAcceptance.target}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Source Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.sourceEfficiency.value}%</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs flex items-center text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpiMetrics.sourceEfficiency.change}%
              </p>
              <Badge variant="outline" className="text-xs">Target: {kpiMetrics.sourceEfficiency.target}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Candidate NPS</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.candidateNPS.value}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs flex items-center text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpiMetrics.candidateNPS.change}
              </p>
              <Badge variant="outline" className="text-xs">Target: {kpiMetrics.candidateNPS.target}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Actionable insights generated from your recruitment data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.impact === "Critical" ? "border-red-500/50 bg-red-500/5" :
                  insight.impact === "High" ? "border-amber-500/50 bg-amber-500/5" :
                  insight.impact === "Positive" ? "border-emerald-500/50 bg-emerald-500/5" :
                  "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {insight.type === "alert" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {insight.type === "optimization" && <Zap className="h-5 w-5 text-amber-500" />}
                    {insight.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <Badge variant={
                    insight.impact === "Critical" ? "destructive" :
                    insight.impact === "High" ? "secondary" :
                    insight.impact === "Positive" ? "default" : "outline"
                  }>
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  {insight.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline Analytics</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="recruiters">Recruiter Performance</TabsTrigger>
          <TabsTrigger value="departments">Department Metrics</TabsTrigger>
        </TabsList>

        {/* Pipeline Analytics */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineMetrics.totalCandidates.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineMetrics.activeJobs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineMetrics.interviewsScheduled}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipelineMetrics.offersExtended}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel</CardTitle>
              <CardDescription>Candidate progression through pipeline stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineMetrics.stages.map((stage, index) => (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{stage.count} candidates</span>
                        {index > 0 && (
                          <Badge variant="outline">
                            {stage.conversionRate}% conversion
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={(stage.count / pipelineMetrics.stages[0].count) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Source Performance */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sourcing Channel Performance</CardTitle>
              <CardDescription>Compare effectiveness and ROI across recruitment sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Source</th>
                      <th className="text-right py-3 px-4 font-medium">Hires</th>
                      <th className="text-right py-3 px-4 font-medium">Applications</th>
                      <th className="text-right py-3 px-4 font-medium">Conversion</th>
                      <th className="text-right py-3 px-4 font-medium">Cost</th>
                      <th className="text-right py-3 px-4 font-medium">Cost/Hire</th>
                      <th className="text-right py-3 px-4 font-medium">Quality Score</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourcePerformance.map((source) => (
                      <tr key={source.source} className="border-b">
                        <td className="py-3 px-4 font-medium">{source.source}</td>
                        <td className="text-right py-3 px-4">{source.hires}</td>
                        <td className="text-right py-3 px-4">{source.applications}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="outline">
                            {((source.hires / source.applications) * 100).toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4">${source.cost.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          ${Math.round(source.cost / source.hires).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant={source.quality >= 85 ? "default" : source.quality >= 80 ? "secondary" : "outline"}>
                            {source.quality}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4">{source.timeToHire} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recruiter Performance */}
        <TabsContent value="recruiters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Leaderboard</CardTitle>
              <CardDescription>Individual recruiter performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recruiterPerformance.map((recruiter, index) => (
                  <div key={recruiter.name} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? "bg-amber-500/20 text-amber-500" :
                      index === 1 ? "bg-slate-400/20 text-slate-400" :
                      index === 2 ? "bg-orange-600/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{recruiter.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < Math.floor(recruiter.rating) ? "bg-amber-500" : "bg-muted"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">{recruiter.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold">{recruiter.hires}</p>
                        <p className="text-xs text-muted-foreground">Hires</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{recruiter.interviews}</p>
                        <p className="text-xs text-muted-foreground">Interviews</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{recruiter.offers}</p>
                        <p className="text-xs text-muted-foreground">Offers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{recruiter.acceptanceRate}%</p>
                        <p className="text-xs text-muted-foreground">Acceptance</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{recruiter.avgTimeToHire}d</p>
                        <p className="text-xs text-muted-foreground">Avg Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Metrics */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4">
            {departmentMetrics.map((dept) => (
              <Card key={dept.department}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{dept.department}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Open Roles</p>
                          <p className="text-xl font-bold">{dept.openRoles}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hires (30d)</p>
                          <p className="text-xl font-bold">{dept.hires}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Time to Hire</p>
                          <p className="text-xl font-bold">{dept.avgTime} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fill Rate</p>
                          <p className="text-xl font-bold">
                            {((dept.hires / (dept.openRoles + dept.hires)) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-64">
                      <p className="text-xs text-muted-foreground mb-2">Budget Utilization</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          ${(dept.spent / 1000).toFixed(0)}k / ${(dept.budget / 1000).toFixed(0)}k
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {((dept.spent / dept.budget) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={(dept.spent / dept.budget) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

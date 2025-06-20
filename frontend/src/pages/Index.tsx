import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { Blocks, Activity, TrendingUp, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

const fetchLatestBlock = async () => {
  const response = await fetch(`${API_BASE}/getLatestBlock`);
  if (!response.ok) throw new Error('Failed to fetch latest block');
  return response.json();
};

const fetchValidation = async () => {
  const response = await fetch(`${API_BASE}/isValid`);
  if (!response.ok) throw new Error('Failed to fetch validation');
  return response.json();
};

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });

  const { data: latestBlock, isLoading: blockLoading } = useQuery({
    queryKey: ['latestBlock'],
    queryFn: fetchLatestBlock,
    refetchInterval: 5000,
  });

  const { data: validation, isLoading: validationLoading } = useQuery({
    queryKey: ['validation'],
    queryFn: fetchValidation,
    refetchInterval: 10000,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: "Add Transaction",
      description: "Create a new blockchain transaction",
      href: "/transactions",
      icon: Activity,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Mine Block",
      description: "Mine pending transactions into a block",
      href: "/mining",
      icon: Blocks,
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      title: "Explore Chain",
      description: "View the complete blockchain",
      href: "/explorer",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            ⛓️ ChainView Portal
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Blockchain Explorer & Transaction Manager
          </p>
          <p className="text-sm text-slate-400">
            {currentTime.toLocaleString()}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-sm font-medium">Total Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {statsLoading ? '...' : stats?.totalBlocks || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-sm font-medium">Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {statsLoading ? '...' : stats?.pendingTransactions || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-sm font-medium">Chain Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={validation?.valid ? "success" : "destructive"} className="text-sm">
                {validationLoading ? 'Checking...' : validation?.valid ? 'Valid' : 'Invalid'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200 text-sm font-medium">Network Hash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-emerald-400 truncate">
                {blockLoading ? '...' : latestBlock?.hash?.substring(0, 16) + '...' || 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Block Info */}
        {latestBlock && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Blocks className="h-5 w-5 text-blue-400" />
                Latest Block
              </CardTitle>
              <CardDescription className="text-slate-400">
                Most recently mined block in the chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Block Index</p>
                  <p className="text-lg font-semibold text-slate-200">#{latestBlock.index}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Timestamp</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {new Date(latestBlock.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Transactions</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {latestBlock.transactions?.length || 0}
                  </p>
                </div>
              </div>
              <Separator className="my-4 bg-slate-700" />
              <div>
                <p className="text-sm text-slate-400 mb-2">Block Hash</p>
                <p className="font-mono text-sm text-emerald-400 break-all">
                  {latestBlock.hash}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-slate-200 group-hover:text-white transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm">Get started</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Blocks, Zap, Clock, Cpu, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

const mineBlock = async () => {
  const response = await fetch(`${API_BASE}/mine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to mine block');
  return response.json();
};

const Mining = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [lastMinedBlock, setLastMinedBlock] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 3000,
  });

  const mutation = useMutation({
    mutationFn: mineBlock,
    onMutate: () => {
      setIsMining(true);
      setMiningProgress(0);
      // Simulate mining progress
      const interval = setInterval(() => {
        setMiningProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      return { interval };
    },
    onSuccess: (data, variables, context) => {
      if (context?.interval) {
        clearInterval(context.interval);
      }
      setMiningProgress(100);
      setLastMinedBlock(data.block);
      setIsMining(false);
      
      toast({
        title: "Block Mined Successfully!",
        description: `Block #${data.block?.index} has been added to the blockchain`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['chain'] });
      
      // Reset progress after a delay
      setTimeout(() => {
        setMiningProgress(0);
      }, 3000);
    },
    onError: (error, variables, context) => {
      if (context?.interval) {
        clearInterval(context.interval);
      }
      setIsMining(false);
      setMiningProgress(0);
      
      toast({
        title: "Mining Failed",
        description: error.message || "Failed to mine block",
        variant: "destructive",
      });
    },
  });

  const handleMineBlock = () => {
    if (stats?.pendingTransactions === 0) {
      toast({
        title: "No Transactions",
        description: "Add some transactions before mining a block",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Mining Center
          </h1>
          <p className="text-xl text-slate-300">
            Mine pending transactions into new blocks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mining Control */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Blocks className="h-5 w-5 text-purple-400" />
                Block Mining
              </CardTitle>
              <CardDescription className="text-slate-400">
                Process pending transactions into a new block
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <Badge 
                    variant={stats?.pendingTransactions > 0 ? "default" : "secondary"}
                    className={`text-lg px-4 py-2 ${
                      stats?.pendingTransactions > 0 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                        : "bg-slate-600"
                    }`}
                  >
                    {isLoading ? '...' : stats?.pendingTransactions || 0} Pending Transactions
                  </Badge>
                </div>
                
                <Button
                  onClick={handleMineBlock}
                  disabled={isMining || isLoading || stats?.pendingTransactions === 0}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {isMining ? (
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 animate-spin" />
                      Mining Block...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Start Mining
                    </div>
                  )}
                </Button>
              </div>

              {(isMining || miningProgress > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Mining Progress</span>
                    <span className="text-slate-200">{Math.round(miningProgress)}%</span>
                  </div>
                  <Progress 
                    value={miningProgress} 
                    className="h-2"
                  />
                  <p className="text-xs text-slate-400 text-center">
                    {miningProgress < 100 
                      ? "Solving proof-of-work algorithm..." 
                      : "Block mined successfully!"
                    }
                  </p>
                </div>
              )}

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <h4 className="text-slate-200 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Mining Information
                </h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Difficulty</span>
                    <span className="text-slate-200">4 leading zeros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Block Reward</span>
                    <span className="text-slate-200">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Algorithm</span>
                    <span className="text-slate-200">SHA-256</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Mined Block */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                {lastMinedBlock ? 'Recently Mined Block' : 'Mining Status'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {lastMinedBlock ? 'Latest block mined in this session' : 'Ready to mine pending transactions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lastMinedBlock ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Block Index</p>
                      <p className="text-lg font-semibold text-slate-200">#{lastMinedBlock.index}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Transactions</p>
                      <p className="text-lg font-semibold text-slate-200">
                        {lastMinedBlock.transactions?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Nonce</p>
                      <p className="text-lg font-semibold text-slate-200 font-mono">
                        {lastMinedBlock.nonce}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Timestamp</p>
                      <p className="text-lg font-semibold text-slate-200">
                        {new Date(lastMinedBlock.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Block Hash</p>
                    <p className="font-mono text-xs text-emerald-400 break-all bg-slate-900/50 p-2 rounded">
                      {lastMinedBlock.hash}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Blocks className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    Ready to Mine
                  </h3>
                  <p className="text-slate-400">
                    Mine your first block to see details here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mining Guide */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-slate-200">Mining Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Collect Transactions</h4>
                  <p className="text-slate-400">
                    All pending transactions from the mempool are gathered for processing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Solve Proof-of-Work</h4>
                  <p className="text-slate-400">
                    Find a nonce that produces a hash with 4 leading zeros.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Add to Chain</h4>
                  <p className="text-slate-400">
                    The new block is added to the blockchain and transactions are confirmed.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Mining;

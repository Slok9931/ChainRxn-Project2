import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Blocks, Clock, Hash, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchChain = async () => {
  const response = await fetch(`${API_BASE}/getChain`);
  if (!response.ok) throw new Error('Failed to fetch blockchain');
  return response.json();
};

const Explorer = () => {
  const { data: chain, isLoading, error } = useQuery({
    queryKey: ['chain'],
    queryFn: fetchChain,
    refetchInterval: 5000,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <Card className="bg-red-900/20 border-red-700">
            <CardContent className="pt-6">
              <p className="text-red-400">Failed to load blockchain data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Blockchain Explorer
          </h1>
          <p className="text-xl text-slate-300">
            View the complete blockchain with all blocks and transactions
          </p>
        </div>

        {isLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center text-slate-400">Loading blockchain...</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {chain?.map((block, index) => (
              <Card key={block.hash} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Blocks className="h-5 w-5 text-blue-400" />
                      Block #{block.index}
                      {index === 0 && <Badge variant="default" className="ml-2">Genesis</Badge>}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      {block.transactions?.length || 0} transactions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Timestamp</p>
                        <p className="text-slate-200 font-mono text-sm">
                          {new Date(block.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Nonce</p>
                        <p className="text-slate-200 font-mono text-sm">{block.nonce}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Previous Hash</p>
                        <p className="text-slate-200 font-mono text-xs truncate w-48">
                          {block.prevHash && block.prevHash !== "0"
                            ? block.prevHash
                            : "Genesis Block"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-slate-700" />

                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-2">Block Hash</p>
                    <p className="font-mono text-sm text-emerald-400 break-all bg-slate-900/50 p-2 rounded">
                      {block.hash}
                    </p>
                  </div>

                  {Array.isArray(block.transactions) && block.transactions.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-400 mb-3">Transactions</p>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {block.transactions.map((tx, txIndex) => (
                            <div key={txIndex} className="bg-slate-900/50 p-3 rounded border border-slate-700">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="text-slate-400">From: </span>
                                  <span className="text-orange-400 font-mono">{tx.sender}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">To: </span>
                                  <span className="text-green-400 font-mono">{tx.recipient}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Amount: </span>
                                  <span className="text-cyan-400 font-mono">{tx.amount}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Explorer;

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Hash, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchBlock = async (hash: string) => {
  const response = await fetch(`${API_BASE}/block/${hash}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Block not found');
    }
    throw new Error('Failed to fetch block');
  }
  return response.json();
};

const fetchChain = async () => {
  const response = await fetch(`${API_BASE}/getChain`);
  if (!response.ok) throw new Error('Failed to fetch blockchain');
  return response.json();
};

const Blocks = () => {
  const [searchHash, setSearchHash] = useState('');
  const [searchedHash, setSearchedHash] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: chain } = useQuery({
    queryKey: ['chain'],
    queryFn: fetchChain,
  });

  const { data: searchedBlock, error: searchError, isLoading: blockLoading } = useQuery({
    queryKey: ['block', searchedHash],
    queryFn: () => fetchBlock(searchedHash),
    enabled: !!searchedHash,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHash.trim()) {
      setSearchedHash(searchHash.trim());
      setIsSearching(true);
    }
  };

  const handleBlockClick = (hash: string) => {
    setSearchHash(hash);
    setSearchedHash(hash);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchHash('');
    setSearchedHash('');
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Block Explorer
          </h1>
          <p className="text-xl text-slate-300">
            Search and explore individual blocks by hash
          </p>
        </div>

        {/* Search Section */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-400" />
              Block Search
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter a block hash to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Enter block hash (e.g., 0000...)"
                className="flex-1 bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 font-mono text-sm"
              />
              <Button 
                type="submit" 
                disabled={!searchHash.trim() || blockLoading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {blockLoading ? "Searching..." : "Search"}
              </Button>
              {isSearching && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearSearch}
                  className="border-slate-600 text-slate-800 hover:bg-slate-700 hover:text-slate-300"
                >
                  Clear
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Results */}
          <div className="space-y-6">
            {isSearching && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-200">Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {blockLoading ? (
                    <div className="text-center py-8">
                      <div className="text-slate-400">Searching for block...</div>
                    </div>
                  ) : searchError ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-red-400 mb-2">Block Not Found</h3>
                      <p className="text-slate-400">
                        No block found with hash: <br />
                        <code className="text-sm font-mono bg-slate-900/50 px-2 py-1 rounded">
                          {searchedHash}
                        </code>
                      </p>
                    </div>
                  ) : searchedBlock ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-200">
                          Block #{searchedBlock.index}
                        </h3>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700">
                          Found
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Timestamp</p>
                          <p className="text-slate-200 font-mono text-sm">
                            {new Date(searchedBlock.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Nonce</p>
                          <p className="text-slate-200 font-mono text-sm">{searchedBlock.nonce}</p>
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Block Hash</p>
                        <p className="font-mono text-xs text-emerald-400 break-all bg-slate-900/50 p-2 rounded">
                          {searchedBlock.hash}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Previous Hash</p>
                        <p className="font-mono text-xs text-slate-300 break-all bg-slate-900/50 p-2 rounded">
                          {searchedBlock.prevHash && searchedBlock.prevHash !== "0"
                            ? searchedBlock.prevHash
                            : "Genesis Block"}
                        </p>
                      </div>

                      {searchedBlock.transactions && searchedBlock.transactions.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-400 mb-3">
                            Transactions ({searchedBlock.transactions.length})
                          </p>
                          <ScrollArea className="h-48">
                            <div className="space-y-2">
                              {searchedBlock.transactions.map((tx, index) => (
                                <div key={index} className="bg-slate-900/50 p-3 rounded border border-slate-700">
                                  <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400">From:</span>
                                      <span className="text-orange-400 font-mono">{tx.sender}</span>
                                      <ArrowRight className="h-3 w-3 text-slate-500" />
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
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Block List */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Hash className="h-5 w-5 text-cyan-400" />
                Available Blocks
              </CardTitle>
              <CardDescription className="text-slate-400">
                Click on any block hash to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {chain?.map((block, index) => (
                    <div
                      key={block.hash}
                      onClick={() => handleBlockClick(block.hash)}
                      className="p-3 bg-slate-900/50 rounded border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-semibold">Block #{block.index}</span>
                          {index === 0 && <Badge variant="default" className="text-xs">Genesis</Badge>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {new Date(block.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-emerald-400 truncate max-w-xs">
                          {block.hash}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {block.transactions?.length || 0} txs
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Search Tips */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-slate-200">Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Full Hash</h4>
                  <p className="text-slate-400">
                    Enter the complete block hash for exact match (starts with 0000...)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Case Sensitive</h4>
                  <p className="text-slate-400">
                    Block hashes are case-sensitive hexadecimal strings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Quick Select</h4>
                  <p className="text-slate-400">
                    Click on any block from the list to auto-fill the search
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

export default Blocks;

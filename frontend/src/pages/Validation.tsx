import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle, XCircle, RefreshCw, AlertTriangle, Hash, Link } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchValidation = async () => {
  const response = await fetch(`${API_BASE}/isValid`);
  if (!response.ok) throw new Error('Failed to fetch validation');
  return response.json();
};

const fetchChain = async () => {
  const response = await fetch(`${API_BASE}/getChain`);
  if (!response.ok) throw new Error('Failed to fetch blockchain');
  return response.json();
};

const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

const Validation = () => {
  const [revalidating, setRevalidating] = useState(false);

  const { data: validation, isLoading: validationLoading, refetch: refetchValidation } = useQuery({
    queryKey: ['validation'],
    queryFn: fetchValidation,
    refetchInterval: 10000,
  });

  const { data: chain, isLoading: chainLoading, refetch: refetchChain } = useQuery({
    queryKey: ['chain'],
    queryFn: fetchChain,
  });

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const runValidation = async () => {
    setRevalidating(true);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5s loader
    await Promise.all([
      refetchValidation(),
      refetchChain(),
      refetchStats(),
    ]);
    setRevalidating(false);
  };

  const validateBlockHashes = () => {
    if (!chain || chain.length === 0) return { valid: true, issues: [] };
    
    const issues = [];
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
      
      if (currentBlock.prevHash !== previousBlock.hash) {
        issues.push({
          type: 'hash_mismatch',
          blockIndex: i,
          message: `Block #${i} prevHash doesn't match Block #${i-1} hash`
        });
      }
      
      if (!currentBlock.hash.startsWith('0000')) {
        issues.push({
          type: 'difficulty',
          blockIndex: i,
          message: `Block #${i} hash doesn't meet difficulty requirement`
        });
      }
    }
    
    return { valid: issues.length === 0, issues };
  };

  const hashValidation = validateBlockHashes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Chain Validation
          </h1>
          <p className="text-xl text-slate-300">
            Verify blockchain integrity and detect potential issues
          </p>
        </div>

        {/* Main Validation Status */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Blockchain Validation Status
              </CardTitle>
              <Button 
                onClick={runValidation}
                disabled={revalidating}
                variant="outline"
                className="border-slate-600 text-slate-800 hover:bg-slate-700 hover:text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${revalidating ? 'animate-spin' : ''}`} />
                {revalidating ? "Revalidating..." : "Revalidate"}
              </Button>
            </div>
            <CardDescription className="text-slate-400">
              Overall blockchain integrity check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              {(validationLoading || revalidating) ? (
                <div className="text-center">
                  <RefreshCw className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-400">Validating blockchain...</p>
                </div>
              ) : validation?.valid ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-400 mb-2">Blockchain Valid</h2>
                  <p className="text-slate-400">All blocks pass integrity checks</p>
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-red-400 mb-2">Blockchain Invalid</h2>
                  <p className="text-slate-400">Issues detected in blockchain structure</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Validation Results */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Hash className="h-5 w-5 text-cyan-400" />
                Hash Chain Validation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Verify hash linkage between blocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Hash Chain Integrity</span>
                  <Badge 
                    variant={
                      revalidating || chainLoading
                        ? "outline"
                        : hashValidation.valid
                          ? "default"
                          : "destructive"
                    }
                    className={
                      revalidating || chainLoading
                        ? "bg-slate-700 text-slate-300"
                        : hashValidation.valid
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                    }
                  >
                    {revalidating || chainLoading
                      ? 'Checking...'
                      : hashValidation.valid
                        ? 'Valid'
                        : 'Invalid'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Block Count</span>
                  <span className="text-slate-200 font-mono">
                    {statsLoading ? '...' : stats?.totalBlocks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Genesis Block</span>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700">
                    Present
                  </Badge>
                </div>

                <Separator className="bg-slate-700" />

                {(revalidating || chainLoading) ? (
                  <div className="text-center text-slate-400 py-4">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                    Checking hash chain integrity...
                  </div>
                ) : hashValidation.issues.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Issues Detected</span>
                    </div>
                    <div className="space-y-2">
                      {hashValidation.issues.map((issue, index) => (
                        <div key={index} className="bg-red-900/20 border border-red-800/30 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive" className="text-xs">
                              Block #{issue.blockIndex}
                            </Badge>
                            <span className="text-red-400 font-medium capitalize">
                              {issue.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-red-300">{issue.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-900/20 border border-green-800/30 p-3 rounded">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">All Checks Passed</span>
                    </div>
                    <p className="text-green-300 text-sm mt-1">
                      All blocks are properly linked and meet difficulty requirements
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Network Health */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Link className="h-5 w-5 text-purple-400" />
                Network Health
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current network status and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded">
                    <p className="text-2xl font-bold text-blue-400">
                      {statsLoading ? '...' : stats?.totalBlocks || 0}
                    </p>
                    <p className="text-sm text-slate-400">Total Blocks</p>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded">
                    <p className="text-2xl font-bold text-cyan-400">
                      {statsLoading ? '...' : stats?.pendingTransactions || 0}
                    </p>
                    <p className="text-sm text-slate-400">Pending Transactions</p>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Network Status</span>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Online
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Mining Difficulty</span>
                    <span className="text-slate-200 font-mono">4 zeros</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Hash Algorithm</span>
                    <span className="text-slate-200 font-mono">SHA-256</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Block Time</span>
                    <span className="text-slate-200">Variable</span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded border border-purple-800/30">
                  <div className="flex items-center gap-2 text-purple-300 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Security Status</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    Blockchain is secured by proof-of-work consensus mechanism with SHA-256 hashing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Information */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-slate-200">Validation Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Hash Verification</h4>
                  <p className="text-slate-400">
                    Ensures each block's hash correctly represents its contents and meets difficulty requirements.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Chain Linkage</h4>
                  <p className="text-slate-400">
                    Verifies that each block properly references the previous block's hash.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Integrity Check</h4>
                  <p className="text-slate-400">
                    Confirms the overall blockchain structure is consistent and unaltered.
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

export default Validation;

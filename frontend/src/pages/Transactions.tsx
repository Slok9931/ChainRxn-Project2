
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Send, Clock, User, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

const addTransaction = async (transaction: { sender: string; recipient: string; amount: number }) => {
  const response = await fetch(`${API_BASE}/addTransaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) throw new Error('Failed to add transaction');
  return response.json();
};

const Transactions = () => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 3000,
  });

  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: (data) => {
      toast({
        title: "Transaction Added",
        description: "Transaction has been added to the mempool successfully",
      });
      setSender('');
      setRecipient('');
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sender.trim() || !recipient.trim() || !amount.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      sender: sender.trim(),
      recipient: recipient.trim(),
      amount: numAmount,
    });
  };

  const generateRandomTransaction = () => {
    const users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const randomSender = users[Math.floor(Math.random() * users.length)];
    let randomRecipient = users[Math.floor(Math.random() * users.length)];
    while (randomRecipient === randomSender) {
      randomRecipient = users[Math.floor(Math.random() * users.length)];
    }
    const randomAmount = (Math.random() * 1000).toFixed(2);

    setSender(randomSender);
    setRecipient(randomRecipient);
    setAmount(randomAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            Transaction Manager
          </h1>
          <p className="text-xl text-slate-300">
            Create and manage blockchain transactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-400" />
                Create New Transaction
              </CardTitle>
              <CardDescription className="text-slate-400">
                Add a new transaction to the mempool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender" className="text-slate-200">Sender</Label>
                  <Input
                    id="sender"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Enter sender address"
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-slate-200">Recipient</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient address"
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-200">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {mutation.isPending ? "Adding..." : "Add Transaction"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomTransaction}
                    className="border-slate-600 text-slate-800 hover:bg-slate-700 hover:text-slate-300"
                  >
                    Random
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mempool Status */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Mempool Status
              </CardTitle>
              <CardDescription className="text-slate-400">
                Transactions waiting to be mined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Pending Transactions</span>
                  <Badge variant="secondary" className="bg-cyan-600 text-white">
                    {isLoading ? '...' : stats?.pendingTransactions || 0}
                  </Badge>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div className="space-y-2">
                  <span className="text-slate-300 text-sm">Network Statistics</span>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Total Blocks</p>
                      <p className="text-slate-200 font-semibold">
                        {isLoading ? '...' : stats?.totalBlocks || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Chain Height</p>
                      <p className="text-slate-200 font-semibold">
                        {isLoading ? '...' : (stats?.totalBlocks ? stats.totalBlocks - 1 : 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {stats?.pendingTransactions > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-800/30">
                    <div className="flex items-center gap-2 text-cyan-300 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Ready for Mining</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {stats.pendingTransactions} transaction{stats.pendingTransactions !== 1 ? 's' : ''} waiting in the mempool. 
                      Head to the mining page to process them into a new block.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Preview */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-slate-200">Transaction Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Sender & Recipient</h4>
                  <p className="text-slate-400">
                    Use any alphanumeric identifier. Can be usernames, addresses, or account IDs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Amount</h4>
                  <p className="text-slate-400">
                    Enter any positive decimal value. The system accepts fractional amounts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">Processing</h4>
                  <p className="text-slate-400">
                    Transactions are added to mempool instantly and processed when mined.
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

export default Transactions;

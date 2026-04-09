import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, X, Loader2 } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, categoryInfo, Category } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spending-advisor`;

export const SpendingAdvisor = () => {
  const { transactions, getSpendingByCategory } = useTransactions();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getSpendingAnalysis = useCallback(() => {
    const spending = getSpendingByCategory();
    const total = Object.values(spending).reduce((sum, val) => sum + val, 0);
    if (total === 0) return 'No spending data yet.';

    const analysis = Object.entries(spending)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => `- ${categoryInfo[cat as Category].label}: ${formatCurrency(amount)} (${Math.round(amount / total * 100)}%)`)
      .join('\n');

    const recent = transactions.slice(0, 5).map(t => `${t.emoji} ${t.description}: ${formatCurrency(t.amount)}`).join('\n');

    return `Weekly spending total: ${formatCurrency(total)}\n\nSpending by category:\n${analysis}\n\nRecent transactions:\n${recent}`;
  }, [transactions, getSpendingByCategory]);

  const streamChat = useCallback(async ({ messages, onDelta, onDone }: { messages: Message[]; onDelta: (t: string) => void; onDone: () => void }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Please log in to use the advisor");
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ messages: messages.slice(-10), spendingData: getSpendingAnalysis() }),
    });
    if (!resp.ok) { const error = await resp.json(); throw new Error(error.error || "Failed to get response"); }
    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });
      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { textBuffer = line + "\n" + textBuffer; break; }
      }
    }
    onDone();
  }, [getSpendingAnalysis]);

  const sendMessage = async (inputText?: string) => {
    const messageText = inputText || input;
    if (!messageText.trim() || isLoading) return;
    if (messageText.length > 500) {
      toast({ variant: "destructive", title: "Message too long", description: "Please keep messages under 500 characters." });
      return;
    }
    const userMsg: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    let assistantContent = '';
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };
    try {
      await streamChat({ messages: [...messages, userMsg], onDelta: updateAssistant, onDone: () => setIsLoading(false) });
    } catch (error) {
      setIsLoading(false);
      toast({ variant: "destructive", title: "Oops!", description: error instanceof Error ? error.message : "Couldn't connect to AI advisor" });
    }
  };

  const quickPrompts = ["How can I spend less on food?", "Analyze my spending habits", "Tips to save more money"];

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-[6.5rem] right-4 h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent shadow-elevated z-50" size="icon">
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 h-[60vh] flex flex-col shadow-elevated z-50 animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="h-4 w-4 text-primary" /></div>
          <div><h3 className="font-semibold text-foreground">Gullak</h3><p className="text-xs text-muted-foreground">Your spending advisor</p></div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-2xl p-4 text-sm">
              <p className="text-foreground font-medium mb-2">👋 Hey there!</p>
              <p className="text-muted-foreground">I'm Gullak, your personal spending advisor. I can help you find ways to save money!</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
              {quickPrompts.map((prompt, i) => (
                <Button key={i} variant="outline" size="sm" className="w-full justify-start text-left h-auto py-2 text-sm" onClick={() => sendMessage(prompt)}>{prompt}</Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{msg.content}</div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start"><div className="bg-muted rounded-2xl px-4 py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div></div>
            )}
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your spending..." className="flex-1" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </Card>
  );
};

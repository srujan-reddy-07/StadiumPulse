"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Send, Coffee, Activity, CheckCircle2, AlertTriangle, Globe, MapPin } from "lucide-react";

type Message = { id: number; sender: string; text: string; time: string; source?: string };

export default function FanAssistant() {
    const [language, setLanguage] = useState<"en" | "es" | "fr">("en");
    const [seatLocation, setSeatLocation] = useState("Section 112, Row A");
    const [inputText, setInputText] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [telemetry, setTelemetry] = useState<any>(null);
    const [concessionLoading, setConcessionLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "assistant",
            text: "Hello! Welcome to MetLife Stadium for the FIFA World Cup. I am your AI Concierge. How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const quickReplies = useMemo(() => ({
        en: ["How do I bypass the Gate A congestion?", "Where is the nearest medical cooling bay?", "Which concession stand has the shortest line?"],
        es: ["¿Cómo evito el atasco de la Puerta A?", "¿Dónde está el puesto médico más cercano?", "¿Qué puesto de comida tiene menos espera?"],
        fr: ["Comment éviter l'attente à la porte A ?", "Où se trouve le poste médical le plus proche ?", "Quel stand de nourriture a le moins d'attente ?"]
    }), []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const fetchConcessions = useCallback(async () => {
        try {
            const res = await fetch("/api/telemetry");
            const data = await res.json();
            if (data.success) setTelemetry(data.telemetry);
        } catch (err) {
            console.error(err);
        } finally {
            setConcessionLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConcessions();
        const interval = setInterval(fetchConcessions, 5000);
        return () => clearInterval(interval);
    }, [fetchConcessions]);

    const handleSendChat = useCallback(async (textToSend?: string) => {
        const text = textToSend || inputText;
        if (!text.trim()) return;
        if (!textToSend) setInputText("");

        const userMsg: Message = {
            id: Date.now(),
            sender: "user",
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, language, seat: seatLocation })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: "assistant",
                    text: data.reply,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    source: data.source
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "assistant",
                text: "I am having trouble connecting to stadium services. Please consult nearby staff.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setChatLoading(false);
        }
    }, [inputText, language, seatLocation]);

    const optimalConcession = useMemo(() => {
        if (!telemetry || !telemetry.concessions) return null;
        return [...telemetry.concessions]
            .filter((c: any) => c.status !== "Incident")
            .sort((a: any, b: any) => a.waitTimeMinutes - b.waitTimeMinutes)[0];
    }, [telemetry]);

    return (
        <main className="bg-slate-950 min-h-screen text-slate-100 font-sans relative py-8 px-4 flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-teal-500/5 to-transparent pointer-events-none z-0"></div>
            <div className="w-full max-w-5xl relative z-10 flex flex-col lg:flex-row gap-8 justify-center items-stretch mt-4">
                <section aria-label="StadiumPulse Platform Information" className="lg:w-2/5 flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">StadiumPulse Fan Companion</h1>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">AI Concierge experience for World Cup matchday tracking.</p>
                        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-4">
                            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-emerald-400" /> Optimal Concession Finder
                            </h2>
                            {concessionLoading ? (
                                <p className="text-xs text-slate-500 animate-pulse">Syncing line logs...</p>
                            ) : optimalConcession ? (
                                <div className="text-xs space-y-1">
                                    <p className="text-slate-400">Fastest Stand: <span className="text-emerald-400 font-bold">{(optimalConcession as any).name}</span></p>
                                    <p className="text-slate-500">Wait: {(optimalConcession as any).waitTimeMinutes} mins</p>
                                </div>
                            ) : <p className="text-xs text-slate-400">Unavailable</p>}
                        </div>
                    </div>
                    <div className="mt-8 border-t border-white/5 pt-4">
                        <Link href="/dashboard" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                            <Activity className="w-4 h-4" /> View Organizer Dashboard
                        </Link>
                    </div>
                </section>

                <section aria-label="Interactive Mobile Concierge" className="lg:w-[420px] max-w-full bg-slate-950 border-[6px] border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col aspect-[9/19]">
                    <div className="bg-slate-900 px-6 pt-6 pb-4 border-b border-white/5">
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] font-mono text-slate-400">PULSE CONCIERGE</span>
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-white/10 rounded-lg p-1">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                <label htmlFor="lang-select" className="sr-only">Select Language</label>
                                <select id="lang-select" value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-transparent text-[10px] font-bold text-slate-200 outline-none border-none">
                                    <option value="en" className="bg-slate-950">EN</option>
                                    <option value="es" className="bg-slate-950">ES</option>
                                    <option value="fr" className="bg-slate-950">FR</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3.5 flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-3 py-2">
                            <MapPin className="w-3.5 h-3.5 text-teal-400" />
                            <label htmlFor="seat-input" className="text-xs text-slate-500 font-semibold">Seat:</label>
                            <input id="seat-input" type="text" value={seatLocation} onChange={(e) => setSeatLocation(e.target.value)} className="bg-transparent text-slate-200 font-bold text-right outline-none flex-1 text-xs" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950 max-h-[460px]" aria-live="polite">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                                <div className={`p-3 rounded-2xl text-xs leading-relaxed font-medium ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-900 border border-white/10 text-slate-100 rounded-tl-none"}`}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1 font-mono">{msg.time}</span>
                            </div>
                        ))}
                        {chatLoading && <p className="text-xs text-slate-500 animate-pulse">AI Concierge processing...</p>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5">
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Quick links">
                            {quickReplies[language]?.map((phrase, i) => (
                                <button key={i} onClick={() => handleSendChat(phrase)} className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-teal-300 border border-teal-500/30 rounded-full transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-400">
                                    {phrase}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="p-4 bg-slate-900 border-t border-white/5 flex gap-2">
                        <label htmlFor="chat-input" className="sr-only">Type question</label>
                        <input id="chat-input" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask concierge..." className="flex-1 bg-slate-950 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none" />
                        <button type="submit" aria-label="Send" className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
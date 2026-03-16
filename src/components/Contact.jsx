"use client";

import { useState, useRef, useEffect } from "react";

// ─── Shared Styles ───────────────────

function useFadeUp(delay = 0) {
    const ref = useRef(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` } };
}

const GreenLabel = ({ children }) => (
    <span className="text-xs tracking-[0.28em] uppercase font-black" style={{ color: "var(--accent)" }}>{children}</span>
);

const Tooltip = ({ children, text, color = "var(--accent)" }) => {
    const [visible, setVisible] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    if (isTouch) return children;

    return (
        <div className="relative" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all duration-300 pointer-events-none z-50 whitespace-nowrap
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{
                    background: "var(--background)",
                    borderColor: "var(--card-border)",
                    boxShadow: "0 4px 20px var(--accent-glow)"
                }}
            >
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: color }}>
                    {text}
                </span>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b"
                    style={{ background: "var(--background)", borderColor: "var(--card-border)" }} />
            </div>
        </div>
    );
};

// ─── Contact Component ─────────────────

const Contact = () => {
    const fadeHeading = useFadeUp(0);
    const fadeForm = useFadeUp(200);

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors(prev => {
                const n = { ...prev };
                delete n[name];
                return n;
            });
        }
    };

    const validateForm = () => {
        const n = {};
        if (!form.name.trim()) n.name = "Name required";
        else if (!form.email.trim()) n.email = "Email required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) n.email = "Invalid email";
        else if (!form.message.trim()) n.message = "Message required";
        setErrors(n);
        return Object.keys(n).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const subject = encodeURIComponent(`Portfolio — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
        const mailtoUrl = `mailto:asvindvincent07@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            window.location.href = mailtoUrl;
            setLoading(false);
            setSent(true);
            setTimeout(() => setSent(false), 5000);
        }, 800);
    };

    return (
        <section id="contact" className="relative z-10 py-32 px-6" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-[700px] mx-auto flex flex-col items-center gap-16">

                {/* Heading */}
                <div ref={fadeHeading.ref} style={fadeHeading.style} className="flex flex-col items-center gap-4 text-center">
                    <GreenLabel>Get In Touch</GreenLabel>
                    <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tight">
                        Contact <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Me</span>
                    </h2>
                    <p className="text-muted-text text-base md:text-lg max-w-md font-medium">
                        Have a project in mind? Let's build something extraordinary together.
                    </p>
                </div>

                {/* Form */}
                <div ref={fadeForm.ref} style={fadeForm.style} className="w-full">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-text/40 ml-1 group-focus-within:text-accent transition-colors">Your Name</label>
                                <input
                                    type="text" name="name" value={form.name} onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`px-6 py-4 rounded-xl bg-card-bg border text-foreground placeholder:text-muted-text/20 focus:outline-none focus:bg-background focus:ring-1 focus:ring-accent/20 transition-all duration-300 ${errors.name ? 'border-red-500/50' : 'border-card-border focus:border-accent/40'}`}
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-text/40 ml-1 group-focus-within:text-accent transition-colors">Your Email</label>
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="john@example.com"
                                    className={`px-6 py-4 rounded-xl bg-card-bg border text-foreground placeholder:text-muted-text/20 focus:outline-none focus:bg-background focus:ring-1 focus:ring-accent/20 transition-all duration-300 ${errors.email ? 'border-red-500/50' : 'border-card-border focus:border-accent/40'}`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-text/40 ml-1 group-focus-within:text-accent transition-colors">Message</label>
                            <textarea
                                name="message" rows={6} value={form.message} onChange={handleChange}
                                placeholder="Tell me about your project..."
                                className={`px-6 py-4 rounded-xl bg-card-bg border text-foreground placeholder:text-muted-text/20 focus:outline-none focus:bg-background focus:ring-1 focus:ring-accent/20 transition-all duration-300 resize-none ${errors.message ? 'border-red-500/50' : 'border-card-border focus:border-accent/40'}`}
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="group relative w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden h-[60px]"
                            style={{
                                background: loading ? "var(--glass-bg)" : (sent ? "var(--accent)" : "var(--glass-bg)"),
                                border: `1px solid ${sent ? "var(--accent)" : "var(--card-border)"}`,
                                color: sent ? "var(--background)" : "var(--accent)"
                            }}
                            onMouseEnter={e => {
                                if (!loading && !sent) {
                                    e.currentTarget.style.background = "linear-gradient(135deg, var(--accent), var(--accent-secondary))";
                                    e.currentTarget.style.color = "var(--background)";
                                    e.currentTarget.style.borderColor = "transparent";
                                    e.currentTarget.style.boxShadow = "0 8px 30px var(--accent-glow)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!loading && !sent) {
                                    e.currentTarget.style.background = "var(--glass-bg)";
                                    e.currentTarget.style.color = "var(--accent)";
                                    e.currentTarget.style.borderColor = "var(--card-border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }
                            }}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {sent ? "Message Sent!" : (loading ? "Initializing..." : "Send Message")}
                                {!loading && !sent && (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:translate-x-1" stroke="currentColor" strokeWidth={3}>
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Socials */}
                    <div className="mt-16 pt-16 border-t border-card-border flex flex-col items-center gap-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-text/20">Connect via</span>
                        <div className="flex items-center gap-8">
                            {[
                                { id: "linkedin", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>, href: "https://in.linkedin.com/in/asvind-v-a-130076377", color: "#0077B5", label: "LinkedIn" },
                                { id: "instagram", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, href: "https://www.instagram.com/asvind_studio.3d/", color: "#E4405F", label: "Instagram" },
                                { id: "behance", icon: <path d="M8.228 15.01h-2.203v-2.042h2.203c.536 0 .964.137 1.284.411.319.273.479.626.479 1.057s-.16.762-.48 1.025c-.32.264-.747.394-1.283.394zm-.251-5.18h-1.952V7.954h1.952c.433 0 .79.103 1.07.311.28.208.42.508.42.901 0 .416-.145.733-.435.952-.29.219-.64.312-1.055.312zm9.14 5.18c-.463 0-.858-.088-1.185-.262-.327-.175-.583-.437-.77-.785l-.014-.04h1.954c.05.158.147.28.291.365.143.084.321.127.534.127.319 0 .56-.08.723-.238.164-.158.246-.388.246-.688 0-.306-.085-.53-.255-.67-.171-.141-.482-.25-.93-.324l-.656-.11c-1.01-.168-1.74-.438-2.19-.81-.45-.371-.675-.953-.675-1.745 0-.74.238-1.318.713-1.734.475-.415 1.135-.623 1.98-.623.774 0 1.391.171 1.85.514.458.343.738.868.841 1.57h-1.926c-.027-.145-.11-.266-.248-.363-.138-.097-.33-.146-.576-.146-.285 0-.5.068-.645.203-.145.135-.218.32-.218.555 0 .227.086.41.258.549.172.138.528.257 1.066.357l.613.111c1.033.181 1.77.472 2.21.874.44.402.66.994.66 1.774 0 .787-.253 1.402-.758 1.848-.506.446-1.229.668-2.17.668zm-9.023 2.022H3.048V6.035h5.115c1.096 0 1.968.259 2.618.777.65.518.975 1.252.975 2.203 0 .546-.118 1.012-.355 1.398s-.599.704-1.086.953c.66.21 1.161.564 1.503 1.063.342.5.513 1.096.513 1.787 0 1.023-.339 1.823-1.016 2.401-.678.577-1.644.866-2.898.866zM17.47 5.034h3.197v1.44H17.47v-1.44z" type="fill" />, href: "https://www.behance.net/asvindvincent1", color: "#0057FF", label: "Behance" }
                            ].map(soc => (
                                <Tooltip key={soc.id} text={soc.label} color={soc.color}>
                                    <a
                                        href={soc.href} target="_blank" rel="noopener noreferrer"
                                        className="group relative w-14 h-14 rounded-2xl flex items-center justify-center border border-card-border bg-card-bg transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = soc.color; e.currentTarget.style.background = `color-mix(in srgb, ${soc.color} 5%, transparent)`; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.background = "var(--card-bg)"; }}
                                    >
                                        <svg viewBox="0 0 24 24" fill={soc.id === "behance" ? "currentColor" : "none"} className="w-6 h-6 text-muted-text/40 group-hover:text-[var(--accent)] transition-colors" stroke={soc.id === "behance" ? "none" : "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-text)" }} onMouseEnter={e => e.currentTarget.style.color = soc.color} onMouseLeave={e => e.currentTarget.style.color = "var(--muted-text)"}>
                                            {soc.icon}
                                        </svg>
                                    </a>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

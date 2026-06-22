"use client";

import { useState } from "react";
import {
  Target,
  CheckSquare,
  Receipt,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Plus,
  Send,
} from "lucide-react";
import { SectionHeader } from "./section-header";

interface JourneyStep {
  id: number;
  time: string;
  label: string;
  title: string;
  description: string;
  concept: string;
}

const steps: JourneyStep[] = [
  {
    id: 0,
    time: "09:00 AM",
    label: "The Compass",
    title: "Start with your Why",
    description:
      "Before diving into tasks, align your mind. iMergix opens to your active high-level goals, keeping your long-term vision and purpose at the center of your day.",
    concept: "Goals & Milestones",
  },
  {
    id: 1,
    time: "11:00 AM",
    label: "The Path",
    title: "Execute with focus",
    description:
      "No more scattered lists. Today's tasks are linked directly to your active milestones. Every task you check off is a visible vote for your future self.",
    concept: "Task Management",
  },
  {
    id: 2,
    time: "03:00 PM",
    label: "The Fuel",
    title: "Sustain your craft",
    description:
      "Close the loop on completed work. Generate and send a beautifully branded, professional invoice to your client in under 10 seconds. No manual math, no spreadsheets.",
    concept: "Invoicing & Finance",
  },
  {
    id: 3,
    time: "05:00 PM",
    label: "The Reflection",
    title: "Restore mental clarity",
    description:
      "At the end of the month, iMergix prompts a lightweight self-reflection. Log your wins, analyze blockers, and set a clean slate for the next month.",
    concept: "Monthly Self-Review",
  },
];

export function VisualJourney() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
  const [invoiceStatus, setInvoiceStatus] = useState<"draft" | "sending" | "sent">("draft");
  const [reflectionText, setReflectionText] = useState<string>("");

  return (
    <section id="journey" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="The Visual Journey"
          title="A day in the aligned life."
          description="See how iMergix connects your goals, tasks, and finances into a single, calm, and distraction-free workflow."
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left: Interactive Timeline */}
          <div className="space-y-4 lg:col-span-5">
            {steps.map((step) => {
              const isSelected = step.id === activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`group flex w-full items-start gap-5 rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-border bg-card shadow-sm translate-x-1"
                      : "border-transparent hover:bg-card-hover/50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs font-bold tracking-wider uppercase ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.time}
                    </span>
                    <span className={`mt-2 h-1.5 w-1.5 rounded-full transition-all duration-300 ${isSelected ? "bg-foreground scale-125" : "bg-border group-hover:bg-muted-foreground"}`} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      {step.concept}
                    </span>
                    <h3 className={`font-serif text-lg font-medium leading-tight transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {step.title}
                    </h3>
                    {isSelected && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground animate-fadeIn">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Live Interactive App Preview */}
          <div className="w-full lg:col-span-7">
            <div className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
              {/* Fake App Header */}
              <div className="flex items-center justify-between border-b border-border/40 bg-background/50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                  iMergix Workspace · {steps[activeStep].time}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Live Demo
                </span>
              </div>

              {/* App Content Area */}
              <div className="p-6 md:p-8 min-h-[340px] flex flex-col justify-center bg-background/30">
                {/* Step 0: Goals & Milestones */}
                {activeStep === 0 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Active Goal</p>
                        <h4 className="font-serif text-xl font-medium text-foreground">Launch Independent Design Studio</h4>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        On Track
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Milestone Progress</span>
                        <span className="font-bold text-foreground">68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: "68%" }} />
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Milestones</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="line-through">Design personal portfolio website</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="line-through">Set up legal business entity</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-foreground">
                          <span className="h-4 w-4 rounded-full border border-border flex items-center justify-center text-[10px] font-bold">3</span>
                          <span>Secure 3 long-term retainer clients</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Task Management */}
                {activeStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Today&apos;s Focus</p>
                        <h4 className="font-serif text-xl font-medium text-foreground">Task Execution</h4>
                      </div>
                      <span className="text-xs text-muted-foreground">Linked to Goal #1</span>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setTaskCompleted(!taskCompleted)}
                            className="mt-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-border transition-all duration-200 hover:border-foreground"
                          >
                            {taskCompleted && <CheckCircle2 className="h-4 w-4 text-background fill-foreground" />}
                          </button>
                          <div>
                            <p className={`text-sm font-medium transition-all ${taskCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              Design Acme Corp homepage & layout
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Project: Acme Rebrand</p>
                          </div>
                        </div>
                        <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 shrink-0">
                          Urgent
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>Click the checkbox to complete the task.</span>
                      {taskCompleted && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                          Milestone progress updated! +5%
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Invoicing & Finance */}
                {activeStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Invoice Builder</p>
                        <h4 className="font-serif text-xl font-medium text-foreground">Invoice #INV-2026-001</h4>
                      </div>
                      <span className="text-xs text-muted-foreground">Client: Acme Corp</span>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm text-xs">
                      <div className="flex justify-between font-semibold border-b border-border/40 pb-2">
                        <span>Description</span>
                        <span>Amount</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Homepage Design & Layout</span>
                        <span>$3,500.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Brand Guidelines & Assets</span>
                        <span>$1,000.00</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-border/40 pt-2 text-sm text-foreground">
                        <span>Total Due</span>
                        <span>$4,500.00</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {invoiceStatus === "draft" && "Ready to send to client."}
                        {invoiceStatus === "sending" && "Sending invoice..."}
                        {invoiceStatus === "sent" && "Sent! Client notified via email."}
                      </p>
                      <button
                        onClick={() => {
                          if (invoiceStatus === "draft") {
                            setInvoiceStatus("sending");
                            setTimeout(() => setInvoiceStatus("sent"), 1500);
                          } else {
                            setInvoiceStatus("draft");
                          }
                        }}
                        disabled={invoiceStatus === "sending"}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold tracking-wider uppercase text-background transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50"
                      >
                        {invoiceStatus === "draft" && (
                          <>
                            Send Invoice <Send className="h-3 w-3" />
                          </>
                        )}
                        {invoiceStatus === "sending" && "Sending..."}
                        {invoiceStatus === "sent" && "Reset Demo"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Monthly Self-Review */}
                {activeStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Self-Reflection</p>
                        <h4 className="font-serif text-xl font-medium text-foreground">Monthly Review</h4>
                      </div>
                      <span className="text-xs text-muted-foreground">Mental Clarity</span>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-muted-foreground">
                        What went well this month?
                      </label>
                      <textarea
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="e.g., Secured Acme Corp retainer, finished portfolio, maintained a 5-day focus streak..."
                        className="w-full h-20 rounded-xl border border-border/60 bg-card px-3 py-2 text-xs text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>Reflecting on wins and blockers reduces operational anxiety.</span>
                      <span className="font-semibold">Saves automatically</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

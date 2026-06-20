"use client";

import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  OnNodesDelete,
  OnEdgesDelete,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import * as htmlToImage from "html-to-image";

import { getDiagram, saveDiagram } from "@/services/diagram";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import NodeSidebar from "./NodeSidebar";
import ArchitectureNode from "./ArchitectureNode";
import { getLayoutedElements } from "@/lib/layout";
import TemplateSidebar from "./TemplateSidebat";
import { architectureTemplates } from "@/data/templates";
import { generateDocumentation } from "@/lib/documentation";
import {
  reviewArchitecture,
  generateArchitecture,
  explainArchitecture,
  chatWithArchitecture,
  getChatHistory,
  improveArchitecture,
  getReviewHistory,
} from "@/services/ai";
import DocumentationPanel from "./DocumentationPanel";
import EditorChat from "./EditorChat";
import { ChatMessage } from "@/types/chat";
import { Improvement } from "@/types/improvement";
import ImprovementPanel from "./ImprovementPanel";
import { exportPDF } from "@/lib/pdf";
import { ReviewHistoryItem } from "@/types/review";
import ReviewHistoryPanel from "./ReviewHistoryPanel";
import { createShareLink } from "@/services/share";
import toast from "react-hot-toast";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  projectId: string;
  projectName: string;
}

/* ─────────────────────────────────────────────
   Tiny SVG icon helper – no extra dependency
───────────────────────────────────────────── */
const paths: Record<string, string> = {
  plus: "M12 5v14M5 12h14",
  layout: "M3 3h18v18H3zM3 9h18M9 21V9",
  image:
    "M3 3h18v18H3 2zM8.5 8.5m-1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M21 15l-5-5L5 21",
  undo: "M9 14 4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  markdown: "M3 5h18v14H3zM7 15V9l2 2 2-2v6M17 11h-4m4 4h-4",
  pdf: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  share:
    "M18 8A3 3 0 1 0 18 2a3 3 0 0 0 0 6zM6 15A3 3 0 1 0 6 9a3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  sparkles:
    "M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z",
  wand: "M15 4l-1 1M4 15l1-1M9 4l2.5 2.5M4 9l2.5 2.5M2 2l20 20M15 5 5 15l4 4 10-10z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z",
  zap: "M13 2 3 14h9l-1 8 10-12h-9z",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  fileText:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  history: "M1 4v6h6M3.5 15A9 9 0 1 0 4 7.5",
  messageCircle:
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  x: "M18 6 6 18M6 6l12 12",
  check: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3",
};

const Icon = ({
  name,
  size = 15,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={paths[name] ?? ""} />
  </svg>
);

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

// Thin vertical divider for the toolbar
const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;

// Small status badge next to project name
const StatusBadge = ({
  status,
}: {
  status: "saved" | "saving" | "unsaved";
}) => {
  const styles = {
    saved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    saving: "bg-amber-50 text-amber-600 border-amber-200",
    unsaved: "bg-red-50 text-red-600 border-red-200",
  };
  const labels = { saved: "Saved", saving: "Saving…", unsaved: "Unsaved" };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status]}`}
    >
      {status === "saved" && <Icon name="check" size={11} />}
      {labels[status]}
    </span>
  );
};

// Generic toolbar button
interface TBtnProps {
  onClick: () => void;
  icon: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  primary?: boolean;
  showLabel?: boolean;
}
const TBtn = ({
  onClick,
  icon,
  label,
  disabled,
  loading,
  loadingLabel,
  primary,
  showLabel = true,
}: TBtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    title={label}
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
      transition-all duration-150 whitespace-nowrap select-none cursor-pointer shrink-0
      disabled:opacity-40 disabled:cursor-not-allowed active:scale-95
      ${
        primary
          ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-700"
          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      }
    `}
  >
    <Icon
      name={loading ? "sparkles" : icon}
      size={14}
      className={loading ? "animate-pulse" : ""}
    />
    {showLabel && (loading ? (loadingLabel ?? label) : label)}
  </button>
);

// Modal wrapper
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  width?: "md" | "lg" | "xl";
  children: React.ReactNode;
}
const Modal = ({
  open,
  onClose,
  title,
  icon,
  width = "lg",
  children,
}: ModalProps) => {
  if (!open) return null;
  const maxW = { md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(9,9,18,0.55)", backdropFilter: "blur(5px)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxW[width]} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icon name={icon} size={14} />
              </span>
            )}
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function ArchitectureEditor({ projectId, projectName }: Props) {
  /* ── state (unchanged) ── */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodeName, setNodeName] = useState("");
  const [saving, setSaving] = useState(false);
  const hasLoaded = useRef(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [documentation, setDocumentation] = useState("");
  const [review, setReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [architecturePrompt, setArchitecturePrompt] = useState("");
  const [generatingArchitecture, setGeneratingArchitecture] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [improving, setImproving] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>([]);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    [],
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [shareLink, setShareLink] = useState("");

  /* ── modal visibility ── */
  const [reviewOpen, setReviewOpen] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [improvOpen, setImprovOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const clearAnalysis = () => {
    setDocumentation("");
    setReview("");
    setExplanation("");
  };

  const saveSnapshot = (currentNodes: Node[], currentEdges: Edge[]) => {
    const snapshot = {
      nodes: structuredClone(currentNodes),
      edges: structuredClone(currentEdges),
    };
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), snapshot]);
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const snapshot = history[historyIndex];
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setHistoryIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const loadDiagram = useCallback(async () => {
    try {
      const data = await getDiagram(projectId);
      if (data.nodes) setNodes(data.nodes);
      if (data.edges) setEdges(data.edges);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load diagram");
    }
  }, [projectId, setNodes, setEdges]);

  const loadChatHistory = async () => {
    try {
      const messages = await getChatHistory(projectId);
      setChatMessages(
        messages.map((message: any) => ({
          role: message.role,
          content: message.content,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await saveDiagram(projectId, { nodes, edges });
      toast.success("Diagram saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save manually");
    }
  };

  const autoSave = async () => {
    try {
      setSaveStatus("saving");
      await saveDiagram(projectId, { nodes, edges });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save automatically");
    } finally {
      setSaveStatus("saved");
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }
    setSaveStatus("unsaved");
    const timeout = setTimeout(() => autoSave(), 2000);
    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  useEffect(() => {
    loadDiagram();
    loadChatHistory();
    loadReviewHistory();
  }, [projectId]);

  const handleAddCustomNode = () => {
    if (!nodeName.trim()) return;
    addNode(nodeName);
    setNodeName("");
  };

  const addNode = (label: string) => {
    if (!label.trim()) return;
    const newNode: Node = {
      id: Date.now().toString(),
      type: "architectureNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label },
    };
    saveSnapshot(nodes, edges);
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodesDelete: OnNodesDelete = (deletedNodes) => {
    console.log("Deleted Nodes: ", deletedNodes);
  };

  const onEdgesDelete: OnEdgesDelete = (deletedEdges) => {
    console.log("Deleted Edges: ", deletedEdges);
  };

  const nodeTypes = useMemo(() => ({ architectureNode: ArchitectureNode }), []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const handleAutoArrange = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );
    saveSnapshot(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    toast.success("Nodes have been arranged");
  };

  const exportPNG = async () => {
    const element = document.querySelector(".react-flow");
    if (!element) return;
    try {
      const dataUrl = await htmlToImage.toPng(element as HTMLElement, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "architecture.png";
      link.href = dataUrl;
      link.click();
      toast.success("Successfully exported PNG!");
    } catch (error) {
      console.error(error);
      toast.error("Failed image generation");
    }
  };

  const applyTemplate = (templateId: string) => {
    if (
      nodes.length > 0 &&
      !window.confirm("This will replace the current diagram. Continue?")
    )
      return;
    const template = architectureTemplates.find((t) => t.id === templateId);
    if (!template) return;
    clearAnalysis();
    saveSnapshot(nodes, edges);
    setNodes(template.nodes);
    setEdges(template.edges);
    toast.success("Template applied");
  };

  const handleGenerateDocs = () => {
    const docs = generateDocumentation(nodes, edges);
    setDocumentation(docs);
    toast.success("Documentation has been generated");
    setDocsOpen(true);
  };

  const handleReviewArchitecture = async () => {
    if (nodes.length === 0) {
      toast.error("Please create an architecture first");
      return;
    }
    try {
      setReviewLoading(true);
      setReview("");
      const docs = generateDocumentation(nodes, edges);
      const response = await reviewArchitecture(projectId, docs);
      setReview(response.review);
      await loadReviewHistory();
      toast.success("Review has been generated");
      setReviewOpen(true);
    } catch (error) {
      console.error(error);
      setReview("Unable to generate review. Please try again.");
      toast.error("Review failed to generate");
    } finally {
      setReviewLoading(false);
    }
  };

  const loadReviewHistory = async () => {
    try {
      const data = await getReviewHistory(projectId);
      setReviewHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateArchitecture = async () => {
    if (!architecturePrompt.trim()) return;
    try {
      setGeneratingArchitecture(true);
      const response = await generateArchitecture(architecturePrompt);
      const data = JSON.parse(response.architecture);
      const generatedNodes = data.nodes.map((node: any, index: number) => ({
        id: node.id,
        type: "architectureNode",
        position: { x: 200, y: index * 150 },
        data: { label: node.label },
      }));
      const generatedEdges = data.edges.map((edge: any, index: number) => ({
        id: `e${index}`,
        source: edge.source,
        target: edge.target,
      }));
      clearAnalysis();
      saveSnapshot(nodes, edges);
      setNodes(generatedNodes);
      setEdges(generatedEdges);
      toast.success("Architecture generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Architecture generation failed");
    } finally {
      setGeneratingArchitecture(false);
    }
  };

  const handleExplainArchitecture = async () => {
    try {
      setExplanationLoading(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await explainArchitecture(docs);
      setExplanation(response.explanation);
      toast.success("Architecture has been explained");
      setExplainOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Architecture can't be explained");
    } finally {
      setExplanationLoading(false);
    }
  };

  const exportMarkdown = () => {
    if (!documentation && !explanation && !review) {
      alert("Nothing to export.");
      return;
    }
    let content = "";
    if (documentation) {
      content += "# Documentation\n\n" + documentation + "\n\n";
    }
    if (explanation) {
      content += "# Explanation\n\n" + explanation + "\n\n";
    }
    if (review) {
      content += "# Review\n\n" + review + "\n";
    }
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "architecture.md";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("md file generated");
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    try {
      setChatLoading(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await chatWithArchitecture(projectId, docs, question);
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: response.answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleImproveArchitecture = async () => {
    try {
      setImproving(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await improveArchitecture(docs);
      const data = JSON.parse(response.suggestions);
      setImprovements(data.suggestions);
      setImprovOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setImproving(false);
    }
  };

  const addImprovementToDiagram = (improvement: Improvement) => {
    saveSnapshot(nodes, edges);
    const nodeId = Date.now().toString();
    const newNode: Node = {
      id: nodeId,
      type: "architectureNode",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: improvement.label },
    };
    setNodes((nds) => [...nds, newNode]);
    if (!improvement.connect_to) return;
    const newEdges: Edge[] = [];
    improvement.connect_to.forEach((targetLabel) => {
      const targetNode = nodes.find(
        (n) =>
          String(n.data?.label).toLowerCase() === targetLabel.toLowerCase(),
      );
      if (targetNode) {
        newEdges.push({
          id: crypto.randomUUID(),
          source: targetNode.id,
          target: nodeId,
        });
      }
    });
    setEdges((eds) => [...eds, ...newEdges]);
  };

  const handleShareArchitecture = async () => {
    try {
      const response = await createShareLink(projectId);
      const link = `${window.location.origin}/share/${response.share_id}`;
      setShareLink(link);
      setShareOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  /* ─────────────────────────────────────────────     RENDER  ───────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="shrink-0 bg-white border-b border-gray-200 shadow-sm">
        {/* Row 1 – branding + node add + save status */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/">
              <Image src="/icon-logo.png" alt="Logo" width={50} height={100} />
            </Link>
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Icon name="sparkles" size={14} className="text-white" />
            </span>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              {projectName}
            </span>
          </div>

          <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />

          {/* Add node */}
          <div className="flex items-center gap-2">
            <input
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomNode()}
              placeholder="Node name…"
              className="h-7 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400
                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400
                         focus:border-transparent w-36 transition-all"
            />
            <TBtn
              onClick={handleAddCustomNode}
              icon="plus"
              label="Add Node"
              primary
            />
          </div>

          {/* Save status pushed to right */}
          <div className="ml-auto flex space-x-5">
            <Link
              href="/dashboard"
              className="flex border px-2 rounded-lg text-sm items-center hover:text-lg transition-all duration-200 ease-in-out hover:text-gray-500"
            >
              {" "}
              <MoveLeft /> Go to Dashboard
            </Link>
            <StatusBadge status={saveStatus} />
          </div>
        </div>

        {/* Row 2 – toolbar */}
        <div
          className="flex items-center gap-1 px-4 py-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Canvas */}
          <TBtn onClick={handleAutoArrange} icon="layout" label="Arrange" />
          <TBtn onClick={exportPNG} icon="image" label="Export PNG" />
          <TBtn onClick={undo} icon="undo" label="Undo" />
          <TBtn onClick={handleSave} icon="save" label="Save" />

          <Divider />

          {/* AI prompt + generate */}
          <input
            value={architecturePrompt}
            onChange={(e) => setArchitecturePrompt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !generatingArchitecture &&
              handleGenerateArchitecture()
            }
            placeholder="Describe architecture…"
            className="h-7 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400
                       focus:border-transparent w-48 transition-all shrink-0"
          />
          <TBtn
            onClick={handleGenerateArchitecture}
            icon="wand"
            label="Generate"
            loading={generatingArchitecture}
            loadingLabel="Generating…"
            primary
          />

          <Divider />

          {/* AI actions */}
          <TBtn
            onClick={handleReviewArchitecture}
            icon="star"
            label="Review"
            loading={reviewLoading}
            loadingLabel="Reviewing…"
          />
          <TBtn
            onClick={handleImproveArchitecture}
            icon="zap"
            label="Improve"
            loading={improving}
            loadingLabel="Analyzing…"
          />
          <TBtn
            onClick={handleExplainArchitecture}
            icon="info"
            label="Explain"
            loading={explanationLoading}
            loadingLabel="Explaining…"
          />
          <TBtn onClick={handleGenerateDocs} icon="fileText" label="Docs" />

          <Divider />

          {/* History */}
          <TBtn
            onClick={() => setHistoryOpen(true)}
            icon="history"
            label="History"
          />

          <Divider />

          {/* Export + Share */}
          <TBtn onClick={exportMarkdown} icon="markdown" label="Export MD" />
          <TBtn
            onClick={() =>
              exportPDF(projectName, documentation, explanation, review)
            }
            icon="pdf"
            label="Export PDF"
          />
          <TBtn onClick={handleShareArchitecture} icon="share" label="Share" />
        </div>
      </header>

      {/* ══════════════════ CANVAS ══════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        <TemplateSidebar onSelectTemplate={applyTemplate} />
        <NodeSidebar onAddNode={addNode} />
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>
      </div>

      {/* ══════════════════ MODALS ══════════════════ */}

      {/* Review */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Architecture Review"
        icon="star"
        width="xl"
      >
        {review ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {review}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-10">
            No review yet. Click "Review" in the toolbar.
          </p>
        )}
      </Modal>

      {/* Explain */}
      <Modal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="Architecture Explanation"
        icon="info"
        width="xl"
      >
        {explanation ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {explanation}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-10">
            No explanation yet. Click "Explain" in the toolbar.
          </p>
        )}
      </Modal>

      {/* Docs */}
      <Modal
        open={docsOpen}
        onClose={() => setDocsOpen(false)}
        title="Generated Documentation"
        icon="fileText"
        width="xl"
      >
        <DocumentationPanel
          documentation={documentation}
          explanation={explanation}
          review={review}
        />
      </Modal>

      {/* Improvements */}
      <Modal
        open={improvOpen}
        onClose={() => setImprovOpen(false)}
        title="Suggested Improvements"
        icon="zap"
        width="lg"
      >
        <ImprovementPanel
          improvements={improvements}
          onAdd={(imp: Improvement) => {
            addImprovementToDiagram(imp);
            setImprovOpen(false);
          }}
        />
      </Modal>

      {/* Review History */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Review History"
        icon="history"
        width="xl"
      >
        <ReviewHistoryPanel reviews={reviewHistory} />
      </Modal>

      {/* Share */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share Diagram"
        icon="share"
        width="md"
      >
        {shareLink ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Anyone with this link can view the diagram.
            </p>
            <div className="flex items-center gap-2">
              <input
                value={shareLink}
                readOnly
                className="flex-1 h-9 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50
                           text-gray-700 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast.success("Copied!");
                }}
                className="h-9 px-4 text-xs font-medium rounded-lg bg-indigo-600 text-white
                           hover:bg-indigo-700 transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Generating share link…
          </p>
        )}
      </Modal>

      {/* ══════════════════ FLOATING CHAT ══════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat popup */}
        {chatOpen && (
          <div
            className="w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl
                       flex flex-col overflow-hidden"
            style={{ height: 480 }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="sparkles" size={12} className="text-white" />
                </span>
                <span className="text-sm font-semibold text-white">
                  AI Assistant
                </span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25
                           flex items-center justify-center text-white transition-colors"
              >
                <Icon name="x" size={12} />
              </button>
            </div>

            {/* EditorChat renders its own messages + input */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <EditorChat
                question={question}
                setQuestion={setQuestion}
                chatMessages={chatMessages}
                chatLoading={chatLoading}
                onAsk={handleAskQuestion}
              />
            </div>
          </div>
        )}

        {/* FAB toggle */}
        <button
          onClick={() => setChatOpen((prev) => !prev)}
          title={chatOpen ? "Close chat" : "Open AI Assistant"}
          className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white
                     shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95
                     flex items-center justify-center relative"
          style={{ width: 52, height: 52 }}
        >
          {chatOpen ? (
            <Icon name="x" size={18} />
          ) : (
            <>
              <Icon name="messageCircle" size={20} />
              {chatMessages.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full
                             text-[10px] text-white flex items-center justify-center font-bold"
                >
                  {chatMessages.length}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

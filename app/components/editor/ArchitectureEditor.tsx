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
  useReactFlow,
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

interface Props {
  projectId: string;
  projectName: string;
}

export default function ArchitectureEditor({ projectId, projectName }: Props) {
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

  // const {getNodes} = useReactFlow()

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [historyIndex, history]);

  const loadDiagram = useCallback(async () => {
    try {
      const data = await getDiagram(projectId);
      if (data.nodes) {
        setNodes(data.nodes);
      }
      if (data.edges) {
        setEdges(data.edges);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load diagram")
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
      await saveDiagram(projectId, {
        nodes,
        edges,
      });
      toast.success("Diagram saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save manually")
    }
  };

  const autoSave = async () => {
    try {
      //   setSaving(true);
      setSaveStatus("saving");
      await saveDiagram(projectId, {
        nodes,
        edges,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save automatically")
    } finally {
      //   setSaving(false);
      setSaveStatus("saved");
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }
    setSaveStatus("unsaved");
    const timeout = setTimeout(() => {
      autoSave();
    }, 2000);
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

      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label,
      },
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
    toast.success("Nodes have been arranged")
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
      toast.success("Successfully exported PNG!")
    } catch (error) {
      console.error(error);
      toast.error("Failed image generation")
    }
  };

  // ======================ARCHITECTURE TEMPLATE==============================
  const applyTemplate = (templateId: string) => {
    if (
      nodes.length > 0 &&
      !window.confirm("This will replace the current diagram. Continue?")
    ) {
      return;
    }
    const template = architectureTemplates.find((t) => t.id === templateId);
    if (!template) return;
    clearAnalysis();
    saveSnapshot(nodes, edges);
    setNodes(template.nodes);
    setEdges(template.edges);
    toast.success("Template applied")
  };

  // ================DOCUMENTATION===========================================
  const handleGenerateDocs = () => {
    const docs = generateDocumentation(nodes, edges);
    setDocumentation(docs);
    toast.success("Documentation has been generated")
  };

  // ======================AI REVIEW=========================================
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
      toast.success("Review has been generated")
    } catch (error) {
      console.error(error);
      setReview("Unable to generate review. Please try again.");
      toast.success("Review failed to generate")
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

  // ===========================AI ARCHITECTURE========================
  const handleGenerateArchitecture = async () => {
    if (!architecturePrompt.trim()) {
      return;
    }
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
      toast.success("Architecture generated successfully")
    } catch (error) {
      console.error(error);
      toast.error("Architecture generation failed")
    } finally {
      setGeneratingArchitecture(false);
    }
  };

  // ==========================AI EXPLANATION===========================
  const handleExplainArchitecture = async () => {
    try {
      setExplanationLoading(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await explainArchitecture(docs);
      setExplanation(response.explanation);
      toast.success("Architecture has been explained")
    } catch (error) {
      console.error(error);
      toast.error("Architecture can't be explained")
    } finally {
      setExplanationLoading(false);
    }
  };

  // ======================EXPORT MARKDOWN FILE================================
  const exportMarkdown = () => {
    if (!documentation && !explanation && !review) {
      alert("Nothing to export.");
      return;
    }
    let content = "";
    if (documentation) {
      content += "#Documentation\n\n";
      content += documentation;
      content += "\n\n";
    }

    if (explanation) {
      content += "# Explanation\n\n";
      content += explanation;
      content += "\n\n";
    }

    if (review) {
      content += "# Review\n\n";
      content += review;
      content += "\n";
    }
    const blob = new Blob([content], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "architecture.md";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("md file generated")
  };

  // ========================QUESTIONING FROM AI============================

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    try {
      setChatLoading(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await chatWithArchitecture(projectId, docs, question);
      // setChatAnswer(response.answer);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
      setQuestion("");
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  // =====================IMPROVE ARCHITECTURE====================================
  const handleImproveArchitecture = async () => {
    try {
      setImproving(true);
      const docs = generateDocumentation(nodes, edges);
      const response = await improveArchitecture(docs);
      const data = JSON.parse(response.suggestions);
      setImprovements(data.suggestions);
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
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: { label: improvement.label },
    };
    setNodes((nds) => [...nds, newNode]);

    if (!improvement.connect_to) {
      return;
    }
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

  // ====================SHARE ARCHITECTURE===============================
  const handleShareArchitecture = async () => {
    try {
      const response = await createShareLink(projectId);

      const link = `${window.location.origin}/share/${response.share_id}`;
      setShareLink(link);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen  flex flex-col">
      <div className="p-4 border-b">
        {/* ============================BUTTONS=========================== */}
        <input
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Node name"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddCustomNode} className="border px-4 py-2 mr-2">
          Add Node
        </button>

        <div className="flex items-center gap-4">
          <button onClick={handleAutoArrange} className="border px-4 py-2 mr-2">
            Auto Arrange
          </button>
          <button onClick={exportPNG} className="border px-4 py-2">
            Export PNG
          </button>
          <button onClick={undo} className="border px-4 py-2">
            Undo
          </button>

          <button onClick={handleGenerateDocs} className="border px-4 py-2">
            Generate Docs
          </button>
          <input
            value={architecturePrompt}
            onChange={(e) => setArchitecturePrompt(e.target.value)}
            placeholder="Describe architecture..."
            className="border p-2 mr-2 w-96"
          />

          <button
            onClick={handleGenerateArchitecture}
            disabled={generatingArchitecture}
            className="border px-4 py-2"
          >
            {generatingArchitecture ? "Generating..." : "Generate Architecture"}
          </button>
          <button
            onClick={handleReviewArchitecture}
            disabled={reviewLoading}
            className="border px-4 py-2"
          >
            {reviewLoading ? "Reviewing..." : "Review Architecture"}
          </button>

          <button
            onClick={handleImproveArchitecture}
            disabled={improving}
            className="border px-4 py-2"
          >
            {improving ? "Analyzing..." : "Improve Architecture"}
          </button>

          <button
            onClick={handleExplainArchitecture}
            disabled={explanationLoading}
            className="border px-4 py-2"
          >
            {explanationLoading ? "Explaining..." : "Explain Architecture"}
          </button>

          <button onClick={handleSave} className="border px-4 py-2">
            Save Diagram
          </button>

          <span>
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "unsaved"
                ? "Unsaved Changes"
                : "Saved"}
          </span>
          <button className="border px-4 py-2" onClick={exportMarkdown}>
            Export Markdown
          </button>
          <button
            onClick={() =>
              exportPDF(projectName, documentation, explanation, review)
            }
            className="border px-4 py-2"
          >
            Export PDF
          </button>
          <button
            onClick={handleShareArchitecture}
            className="border px-4 py-2"
          >
            Share
          </button>
        </div>
        {/* ========================================= */}
      </div>
      <div className="flex flex-1">
        <TemplateSidebar onSelectTemplate={applyTemplate} />
        <NodeSidebar onAddNode={addNode} />
        <div className="flex-1" ref={reactFlowWrapper}>
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
      {shareLink && (
        <div className="mt-3 flex gap-2">
          <input value={shareLink} readOnly className="border p-2 w-[600px]" />

          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="border px-4"
          >
            Copy
          </button>
        </div>
      )}
      <DocumentationPanel
        documentation={documentation}
        explanation={explanation}
        review={review}
      />

      {/* ===============REVIEW HISTORY==================================
       */}
      <ReviewHistoryPanel reviews={reviewHistory} />

      {/* AI ASSISTANT================================================== */}
      <EditorChat
        question={question}
        setQuestion={setQuestion}
        chatMessages={chatMessages}
        chatLoading={chatLoading}
        onAsk={handleAskQuestion}
      />
      <ImprovementPanel
        improvements={improvements}
        onAdd={addImprovementToDiagram}
      />
    </div>
  );
}

"use client";

import { architectureTemplates } from "@/data/templates";

interface Props {
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateSidebar({ onSelectTemplate }: Props) {
  return (
    <div className="border-b p-4 hidden md:flex max-h-screen">
      <div>
        <h2 className="font-bold mb-2">Templates</h2>

        <div className="flex flex-col gap-2">
          {architectureTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="border px-4 py-2"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

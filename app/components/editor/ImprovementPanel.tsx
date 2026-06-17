import { Improvement } from "@/types/improvement";

interface Props {
  improvements: Improvement[];
  onAdd: (improvement: Improvement) => void;
}

export default function ImprovementPanel({ improvements, onAdd }: Props) {
  if (improvements.length == 0) {
    return null;
  }

  return (
    <div className="border-t p-4">
      <h2 className="font-bold text-lg mb-4">Suggested Improvements</h2>

      <div className="space-y-4">
        {improvements.map((improvement, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-semibold">{improvement.label}</h3>

            <p className="text-sm">{improvement.reason}</p>

            <button
              onClick={() => onAdd(improvement)}
              className="mt-2 border px-3 py-1"
            >
              Add To Diagram
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

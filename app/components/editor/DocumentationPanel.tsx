interface Props {
  documentation: string;
  explanation: string;
  review: string;
}

export default function DocumentationPanel({
  documentation,
  explanation,
  review,
}: Props) {
  return (
    <div>
      {documentation && (
        <div className="border-t p-4">
          <h2 className="font-bold text-lg mb-2">Documentation</h2>

          <pre className="whitespace-pre-wrap">{documentation}</pre>
        </div>
      )}

      {explanation && (
        <div className="border-t p-4">
          <h2 className="font-bold text-lg mb-2">Architecture Explanation</h2>

          <pre className="whitespace-pre-wrap">{explanation}</pre>
        </div>
      )}

      {review && (
        <div className="border-t p-4">
          <h2 className="font-bold text-lg mb-2">AI Architecture Review</h2>

          <pre className="whitespace-pre-wrap">{review}</pre>
        </div>
      )}
    </div>
  );
}

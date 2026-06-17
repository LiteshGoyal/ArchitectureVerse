import jsPDF from "jspdf";


function addSection(
    doc: jsPDF,
    title: string,
    content: string,
    y: number 
){
    doc.setFontSize(14)
    doc.text(title,20,y)

    y+=10

    doc.setFontSize(11)

    const lines = doc.splitTextToSize(content,170)

    for (const line of lines){
        if(y>270){
            doc.addPage()
            y=20
        }
        doc.text(line,20,y)
        y+=7

    }
    return y+10
}



export const exportPDF = (
  projectName: string,
  documentation: string,
  explanation: string,
  review: string,
) => {
    alert(projectName)
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);

  doc.text(projectName || "Report", 20, y);

  y += 15;

  doc.setFontSize(14);
  if (documentation) {
  y = addSection(
    doc,
    "Documentation",
    documentation,
    y
  );
}

  doc.setFontSize(14);

  if (explanation) {
  y = addSection(
    doc,
    "Explanation",
    explanation,
    y
  );
}

  doc.setFontSize(14);

  if (review) {
  y = addSection(
    doc,
    "Review",
    review,
    y
  );
}

  doc.save(`${projectName}.pdf`);
};

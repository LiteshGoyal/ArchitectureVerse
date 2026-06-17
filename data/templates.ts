export const architectureTemplates = [
  {
    id: "react-django",
    name: "React + Django",
    nodes: [
      {
        id: "1",
        type: "architectureNode",
        position: { x: 100, y: 100 },
        data: { label: "React" },
      },
      {
        id: "2",
        type: "architectureNode",
        position: { x: 100, y: 250 },
        data: { label: "Django" },
      },
      {
        id: "3",
        type: "architectureNode",
        position: { x: 100, y: 400 },
        data: { label: "PostgreSQL" },
      },
    ],
    edges:[
        {
            id:"e1-2",
            source:"1",
            target:"2"
        },
        {
            id:"e2-3",
            source:"2",
            target:"3"
        },
    ]
  },
];

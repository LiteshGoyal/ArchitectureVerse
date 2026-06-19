export const architectureTemplates = [
  {
    id: "react-django",
    name: "React + Django",
    nodes: [
      { id: "1", type: "architectureNode", position: { x: 100, y: 100 }, data: { label: "React" } },
      { id: "2", type: "architectureNode", position: { x: 100, y: 250 }, data: { label: "Django" } },
      { id: "3", type: "architectureNode", position: { x: 100, y: 400 }, data: { label: "PostgreSQL" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ]
  },
  {
    id: "mern-stack",
    name: "MERN Stack",
    nodes: [
      { id: "1", type: "architectureNode", position: { x: 100, y: 100 }, data: { label: "React" } },
      { id: "2", type: "architectureNode", position: { x: 100, y: 200 }, data: { label: "Node/Express" } },
      { id: "3", type: "architectureNode", position: { x: 100, y: 300 }, data: { label: "MongoDB" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ]
  },
  {
    id: "nextjs-serverless",
    name: "Next.js + Serverless",
    nodes: [
      { id: "1", type: "architectureNode", position: { x: 100, y: 100 }, data: { label: "Next.js" } },
      { id: "2", type: "architectureNode", position: { x: 300, y: 100 }, data: { label: "AWS Lambda" } },
      { id: "3", type: "architectureNode", position: { x: 300, y: 250 }, data: { label: "DynamoDB" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ]
  },
  {
    id: "microservices-kafka",
    name: "Microservices + Kafka",
    nodes: [
      { id: "1", type: "architectureNode", position: { x: 100, y: 100 }, data: { label: "API Gateway" } },
      { id: "2", type: "architectureNode", position: { x: 250, y: 100 }, data: { label: "Auth Service" } },
      { id: "3", type: "architectureNode", position: { x: 250, y: 250 }, data: { label: "Kafka" } },
      { id: "4", type: "architectureNode", position: { x: 400, y: 250 }, data: { label: "Order Service" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ]
  },
  {
    id: "data-analytics",
    name: "Data Analytics Pipeline",
    nodes: [
      { id: "1", type: "architectureNode", position: { x: 100, y: 100 }, data: { label: "Data Sources" } },
      { id: "2", type: "architectureNode", position: { x: 100, y: 250 }, data: { label: "Apache Airflow" } },
      { id: "3", type: "architectureNode", position: { x: 300, y: 250 }, data: { label: "Snowflake" } },
      { id: "4", type: "architectureNode", position: { x: 300, y: 400 }, data: { label: "Looker/Tableau" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ]
  }
];
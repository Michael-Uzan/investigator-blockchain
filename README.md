# Investigator Blockchain

[Link to the App](https://investigator-blockchain.vercel.app/)

![Project Logo](./public/bitcoin.png)

**Investigator Blockchain** is a web-based tool for visually exploring Bitcoin transactions, addresses, and networks. It provides an interactive graph interface to track the flow of transactions, analyze blockchain data, and inspect relationships between addresses.

<img width="1699" height="899" alt="Screenshot 2025-09-08 at 10 25 25" src="https://github.com/user-attachments/assets/99930e5e-cb98-40b8-8bda-9f472f3d2fe2" />
<img width="416" height="841" alt="Screenshot 2025-09-08 at 10 27 00" src="https://github.com/user-attachments/assets/7fbfeac6-9f4c-457d-9f24-94ef89a1b83f" />



---

## Features

- Visualize Bitcoin addresses and transactions as interactive nodes and edges.  
- Filter and highlight nodes based on selection.  
- Track inputs and outputs of transactions.  
- Logging and state management for debugging and analysis.  
- Responsive and modern UI using React and Chakra UI.  

---

## Tech Stack

- **Frontend:** React 19, TypeScript  
- **State Management:** @legendapp/state  
- **UI Components:** Chakra UI, Framer Motion  
- **Graph Visualization:** react-force-graph-2d  
- **HTTP Requests:** Axios  
- **Build Tool:** Vite  
- **Testing:** Jest, Testing Library  
- **Deployment:** Vercel  

---

## Data Source

Blockchain data is fetched from the [Blockstream API](https://blockstream.info/api/).  


- **Graph Store:** Manages nodes, edges, and selection in the graph.  
- **Log Store:** Tracks API requests, responses, and errors.  
- **Services:** Axios wrapper (`httpService`) and `blockstreamService` for fetching transactions.  
- **Graph Rendering:** Uses `react-force-graph-2d` for interactive visualization.

## How the Fetch Works

1. The user enters a Bitcoin address.  
2. `blockstreamService.fetchAddressTxs(address)` is called.  
3. `httpService.get(url, params)` uses Axios to fetch transaction data.  
4. Fetch data is stored in the `logStore$` for debugging and history.  
5. Nodes and edges are created with `graphUtils.buildNodesAndEdges` and `graphUtils.buildNodesAndLinks`.  
6. `graphStore$` updates the graph visualization.  

---

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed.  
Clone the repository and install dependencies:

```bash
git clone https://github.com/<your-username>/investigator-blockchain.git
cd investigator-blockchain
pnpm install
```

## Run 

```bash
pnpm run dev
```




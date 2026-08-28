import { useState } from 'react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('portfolio');

  const handleSubmit = async (e) => {
    // This exact line stops the page from refreshing!
    e.preventDefault(); 
    
    console.log("Sending to Orchestrator:", { prompt, template }); 

    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, template }),
      });

      const data = await response.json();
      console.log("Backend responded:", data);
      
      alert(`Success: ${data.message}`); 
      
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the Orchestrator. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold mb-6 text-amber-500">OmniRoute AI Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Select Architecture Template</label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="portfolio">Developer Portfolio</option>
              <option value="ecommerce">E-Commerce Store</option>
              <option value="saas">SaaS Dashboard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">System Parameters (Prompt)</label>
            <textarea 
              className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none resize-none transition-all"
              placeholder="Describe the website features, components, and specific technical requirements..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg"
          >
            Initialize Generation Sequence
          </button>
        </form>
      </div>
    </div>
  );
}666
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import LiveChat from './pages/LiveChat';
import VoiceAnalysis from './pages/VoiceAnalysis';
import MemoryRetrieval from './pages/MemoryRetrieval';
import AISupervisor from './pages/AISupervisor';
import HindsightLearning from './pages/HindsightLearning';
import Analytics from './pages/Analytics';

// Placeholder components for other routes
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-4xl font-bold text-white/20 uppercase tracking-[0.2em]">{title}</h1>
    <p className="text-white/40 mt-4 font-mono">NEURAL MODULE UNDER CONSTRUCTION</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard Routes nested in MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<LiveChat />} />
          <Route path="voice" element={<VoiceAnalysis />} />
          <Route path="supervisor" element={<AISupervisor />} />
          <Route path="memory" element={<MemoryRetrieval />} />
          <Route path="learning" element={<HindsightLearning />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

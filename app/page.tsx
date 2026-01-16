import LeftPanel from "@/components/layout/LeftPanel";
import CenterCanvas from "@/components/layout/CenterCanvas";
import RightPanel from "@/components/layout/RightPanel";

export default function Home() {
  return (
    <div className="flex h-screen bg-bg-app">
      <LeftPanel />
      <CenterCanvas />
      <RightPanel />
    </div>
  );
}

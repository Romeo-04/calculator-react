// app/page.js - The root route of our app
// This is a Server Component by default (no "use client")
// It just imports and renders our Calculator

import Calculator from "./components/Calculator";

export default function Home() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      {/* Our Calculator component handles all the interactive logic */}
      <Calculator />
    </div>
  );
}

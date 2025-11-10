// This is a Client Component because it uses interactive features
"use client";

import { useState, useEffect, useCallback } from "react"; // React hooks
import { evaluateExpression, formatResult } from "../utils/evaluator";

// Button configuration - defines each button's label, value, and style
// We will create an array of button objects to use map over it
const buttons = [
  { label: "C", value: "clear", variant: "function" },
  { label: "DEL", value: "delete", variant: "function" },
  { label: "÷", value: "/", variant: "operator" },
  { label: "×", value: "*", variant: "operator" },
  
  { label: "7", value: "7", variant: "number" },
  { label: "8", value: "8", variant: "number" },
  { label: "9", value: "9", variant: "number" },
  { label: "−", value: "-", variant: "operator" },
  
  { label: "4", value: "4", variant: "number" },
  { label: "5", value: "5", variant: "number" },
  { label: "6", value: "6", variant: "number" },
  { label: "+", value: "+", variant: "operator" },
  
  { label: "1", value: "1", variant: "number" },
  { label: "2", value: "2", variant: "number" },
  { label: "3", value: "3", variant: "number" },
  { label: "=", value: "=", variant: "equals", span: 2 }, 
  
  { label: "0", value: "0", variant: "number", span: 2 },
  { label: ".", value: ".", variant: "number" },
];

export default function Calculator() {
  // STATE: used when there is a change in data/variables
  // display = what shows on screen
  // expression = the full math expression being built for logic side
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(""); // For error messages

  // EVENT HANDLER: Will be used as event listener for button clicks
  // useCallback prevents the function from being recreated on every render
  const handleButtonClick = useCallback((value) => {
    // Clear error on any new input
    if (error) setError("");

    // Will handle the logic for each button present
    if (value === "clear") {
      // C button - reset everything
      setDisplay("0");
      setExpression("");
    } 
    else if (value === "delete") {
      // DEL button - remove last character
      if (display.length === 1) {
        setDisplay("0"); // Don't leave display empty
      } else {
        setDisplay(display.slice(0, -1)); // Remove last char
      }
    }

    else if (value === "=") {
      // Equals button - evaluate the full expression!
      try {
        const fullExpression = expression + display;
        if (!fullExpression || fullExpression === "0") {
          return; // Nothing to evaluate
        }
        
        // Call our safe evaluator
        const result = evaluateExpression(fullExpression);
        const formatted = formatResult(result);
        
        // Update display with result and clear expression
        setDisplay(formatted);
        setExpression(""); // Clear for next calculation
      } catch (err) {
        // Show error message in red
        setError(err.message || "Error");
        setExpression("");
      }
    }

    else if (["+", "-", "*", "/"].includes(value)) {
      // Operator button - add to expression and reset display
      if (display === "0" && expression === "") return; // Don't start with operator
      setExpression(expression + display + " " + value + " ");
      setDisplay("0");
    }
    else if (value === ".") {
      // Decimal point - only add if not already present
      if (!display.includes(".")) {
        setDisplay(display + ".");
      }
    }

    else {
      // Number button (0-9)
      if (display === "0") {
        setDisplay(value); // Replace initial "0"
      } else {
        setDisplay(display + value); // Append digit
      }
    }
  }, [display, expression, error]); // Dependencies for useCallback

  // KEYBOARD SUPPORT: Listen for key presses
  useEffect(() => {
    // Map keyboard keys to calculator button values
    const keyMap = {
      "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
      "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
      "+": "+", "-": "-", "*": "*", "/": "/",
      ".": ".", "Enter": "=", "=": "=",
      "Backspace": "delete", "Delete": "delete",
      "Escape": "clear", "c": "clear", "C": "clear"
    };

    // Handler for keyboard events
    const handleKeyPress = (event) => {
      const key = event.key;
      const value = keyMap[key];
      
      if (value) {
        event.preventDefault(); // Prevent default browser behavior
        handleButtonClick(value); // Reuse our existing handler!
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // CLEANUP: Remove listener when component unmounts
    // This prevents memory leaks!
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [display, expression, error, handleButtonClick]); // Include all dependencies

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      width: "340px"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "16px",
        color: "#333",
        fontSize: "24px",
        fontWeight: "600"
      }}>
        Calculator
      </h1>
      
      {/* DISPLAY AREA - shows current expression and result */}
      <div 
        role="region" 
        aria-label="Calculator display"
        aria-live="polite" // Screen readers announce changes
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          minHeight: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* Expression display (what user typed) */}
        <div 
          aria-label="Expression"
          style={{
            fontSize: "16px",
            color: "#666",
            textAlign: "right",
            minHeight: "20px",
            marginBottom: "8px"
          }}
        >
          {expression || " "} {/* Show expression or space */}
        </div>
        
        {/* Result display (current number or answer) */}
        <div 
          aria-label={error ? "Error" : "Current value"}
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: error ? "#ff6b6b" : "#333", // Red if error
            textAlign: "right",
            wordBreak: "break-all"
          }}
        >
          {error || display} {/* Show error or current display */}
        </div>
      </div>
      
      {/* BUTTON GRID - CSS Grid makes layout easy */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 4 equal columns
        gridTemplateRows: "repeat(5, 1fr)",    // 5 equal rows
        gap: "10px"
      }}>
        {buttons.map((btn) => {
          // Determine button color based on variant
          let bgColor = "#e9ecef"; // default (numbers)
          let textColor = "#333";
          
          if (btn.variant === "operator") {
            bgColor = "#667eea";
            textColor = "white";
          } else if (btn.variant === "function") {
            bgColor = "#ff6b6b";
            textColor = "white";
          } else if (btn.variant === "equals") {
            bgColor = "#51cf66";
            textColor = "white";
          }

          // Generate descriptive label for screen readers
          const getAriaLabel = () => {
            if (btn.value === "clear") return "Clear all";
            if (btn.value === "delete") return "Delete last character";
            if (btn.value === "=") return "Calculate result";
            if (btn.variant === "operator") {
              const opNames = { "+": "plus", "-": "minus", "*": "multiply", "/": "divide" };
              return opNames[btn.value] || btn.value;
            }
            return btn.label;
          };

          return (
            <button
              key={btn.value}
              onClick={() => handleButtonClick(btn.value)}
              aria-label={getAriaLabel()} // Accessibility: describes button to screen readers
              tabIndex={0} // Accessibility: makes button keyboard-navigable with Tab
              style={{
                padding: "20px",
                fontSize: "20px",
                fontWeight: "600",
                border: "none",
                borderRadius: "8px",
                background: bgColor,
                color: textColor,
                cursor: "pointer",
                transition: "all 0.2s",
                // Special grid placement for buttons that span multiple cells
                gridColumn: btn.label === "0" ? "span 2" : "auto",
                gridRow: btn.label === "=" ? "span 2" : "auto"
              }}
              // Hover effect - inline event handlers
              onMouseEnter={(e) => e.target.style.opacity = "0.8"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

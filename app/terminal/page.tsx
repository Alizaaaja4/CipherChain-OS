"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [output, setOutput] = useState<string[]>([
    "Welcome to ScryptoSim Terminal!",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [path, setPath] = useState<string[]>(["root"]);
  const [time, setTime] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const [pValue, setPValue] = useState<number | null>(null); // State for 'p' value
  const [qValue, setQValue] = useState<number | null>(null); // State for 'q' value
  const [eValue, setEValue] = useState<number | null>(null); // State for 'e' value
  const [algorithmStep, setAlgorithmStep] = useState<"start" | "p" | "q" | "e" | "result">("start"); // Track RSA input steps
  const [loading, setLoading] = useState(false); // Track loading state

  const directories = {
    root: ["ScryptoSim"],
    ScryptoSim: ["rsa", "elgamal", "sha256"],
    rsa: ["input", "process", "output"],
    elgamal: ["input", "process", "output"],
    sha256: ["input", "process", "output"],
  };

  const terminalRef = useRef<HTMLDivElement>(null);

  const updateTime = () => {
    const now = new Date();
    setTime(now.toLocaleString());
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
  }, [output]);

  const handleCommand = () => {
    const currentDir = path[path.length - 1];
    const currentFolders = directories[currentDir] || [];

    if (input.toLowerCase() === "cls") {
      setOutput(["Welcome to ScryptoSim Terminal!", "Type 'help' to see available commands."]);
    } else if (input.toLowerCase() === "ls") {
      setOutput((prevOutput) => [
        ...prevOutput,
        `Listing contents of ${currentDir}:`,
        ...currentFolders,
      ]);
    } else if (input.toLowerCase().startsWith("cd ")) {
      const folder = input.substring(3).trim();
      if (currentFolders.includes(folder)) {
        setPath([...path, folder]);
        setOutput((prevOutput) => [...prevOutput, `Changed directory to ${folder}`]);
      } else if (folder === "..") {
        setPath(path.slice(0, path.length - 1));
        setOutput((prevOutput) => [...prevOutput, "Returned to previous directory"]);
      } else {
        setOutput((prevOutput) => [...prevOutput, `No such directory: ${folder}`]);
      }
    } else if (input.toLowerCase() === "help") {
      setOutput((prevOutput) => [
        ...prevOutput,
        "Available commands:",
        "- cls: Clear the terminal.",
        "- ls: List directories.",
        "- cd [folder]: Change directory.",
        "- rsa: Start RSA simulation.",
        "- elgamal: Start ElGamal simulation.",
        "- sha256: Test SHA-256 hashing.",
      ]);
    } else if (input.toLowerCase() === "npm run rsa" && path[path.length - 1] === "rsa") {
      setOutput((prevOutput) => [
        ...prevOutput,
        "Starting RSA simulation. Please enter the value for 'p':",
      ]);
      setAlgorithmStep("p");
    } else {
      setOutput((prevOutput) => [...prevOutput, `'${input}' is not a recognized command.`]);
    }

    setInput(""); // Reset input field
  };

  const handleRSAInput = () => {
    const numInput = Number(input); // Convert the input to a number
  
    if (algorithmStep === "p") {
      setOutput((prevOutput) => [...prevOutput, `You entered p = ${input}`]);
      setPValue(numInput); // Store value for 'p'
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'q':"]);
      setAlgorithmStep("q");
    } else if (algorithmStep === "q") {
      setOutput((prevOutput) => [...prevOutput, `You entered q = ${input}`]);
      setQValue(numInput); // Store value for 'q'
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'e' (must be greater than 1 and less than (p-1)*(q-1)):"]);
      setAlgorithmStep("e");
    } else if (algorithmStep === "e") {
      const e = numInput;
  
      // Validate 'e' and proceed to calculation
      if (e > 1 && e < (pValue! - 1) * (qValue! - 1)) {
        setEValue(e); // Store value for 'e'
        setOutput((prevOutput) => [...prevOutput, `You entered e = ${e}`]);
        setOutput((prevOutput) => [...prevOutput, "Calculating RSA... Please wait."]);
        setLoading(true); // Start loading
        setAlgorithmStep("result");
  
        // Simulate RSA calculation with loading
        setTimeout(() => {
          setLoading(false); // Stop loading
  
          const n = pValue! * qValue!;
          const phi = (pValue! - 1) * (qValue! - 1);
          const d = modInverse(e, phi); // Calculate private key 'd'
  
          // Generate output after calculation (without plaintext input)
          setOutput((prevOutput) => [
            ...prevOutput,
            `n = p * q = ${n}`,
            `φ(n) = (p-1) * (q-1) = ${phi}`,
            `Public Key: (e = ${e}, n = ${n})`,
            `Private Key: (d = ${d}, n = ${n})`,
          ]);
        }, 2000); // Simulate 2 seconds of processing time
      } else {
        setOutput((prevOutput) => [
          ...prevOutput,
          "Invalid value for e. Ensure that 1 < e < (p-1)*(q-1). Please enter a valid value for 'e':",
        ]);
      }
    }
  
    setInput(""); // Reset input field after handling
  };  
  
  // Function to compute the modular inverse of a number
  function modInverse(a: number, m: number): number {
    let m0 = m;
    let y = 0;
    let x = 1;
    if (m === 1) return 0;
    while (a > 1) {
      const q = Math.floor(a / m);
      let t = m;
      m = a % m;
      a = t;
      t = y;
      y = x - q * y;
      x = t;
    }
    if (x < 0) x += m0;
    return x;
  }

  // Function for modular exponentiation (a^b % m)
  function modExp(a: number, b: number, m: number): number {
    let result = 1;
    a = a % m;
    while (b > 0) {
      if (b % 2 === 1) {
        result = (result * a) % m;
      }
      b = Math.floor(b / 2);
      a = (a * a) % m;
    }
    return result;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B007A] via-[#FF007F] to-[#4A003F] flex flex-col items-center justify-center p-6">
      {/* Terminal Container */}
      <div className="bg-black bg-opacity-80 text-[#00ff00] font-mono rounded-lg shadow-lg w-full max-w-3xl">
        {/* Header Bar */}
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-t-lg">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="ml-auto text-gray-400 text-sm">ScryptoSim Terminal</span>
        </div>

        {/* Date and Time */}
        <div className="absolute top-4 left-4 text-md text-gray-200">{time}</div>

        {/* Terminal Window */}
        <div className="p-4" ref={terminalRef}>
          {/* Output Section */}
          <div className="flex flex-col gap-1">
            {output.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[#00ff00]">guest@cryptosim:~{path.join("/")}$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (algorithmStep === "start" || algorithmStep === "result") {
                    handleCommand();
                  } else if (algorithmStep === "p" || algorithmStep === "q" || algorithmStep === "e") {
                    handleRSAInput();
                  }
                }
              }}
              className="bg-transparent text-[#00ff00] border-none outline-none w-full"
              autoFocus
            />
          </div>

          {/* Loading Indicator */}
          {loading && <div className="text-[#00ff00] mt-2">Processing...</div>}
        </div>
      </div>

      {/* Info Icon */}
      <div
        className="absolute bottom-4 right-4 cursor-pointer text-[#00ff00] text-2xl"
        onClick={() => setShowInfo(!showInfo)}
      >
        ℹ️
      </div>

      {/* Info Pop-up */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg w-96 text-[#00ff00]">
            <h2 className="text-xl font-bold">ScryptoSim Terminal</h2>
            <p className="mt-4">Developer: Aliza Nurfitrian</p>
            <p className="mt-2">This is a simulated terminal for testing cryptographic algorithms like RSA, ElGamal, and SHA-256.</p>
            <button
              className="mt-4 bg-[#FF007F] text-[#00ff00] py-2 px-4 rounded-md"
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

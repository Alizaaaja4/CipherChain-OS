"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/navbar";

export default function Home() {
  const router = useRouter();
  const [output, setOutput] = useState<string[]>([
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [path, setPath] = useState<string[]>(["root"]);
  const [time, setTime] = useState("");
  const [showInfo, setShowInfo] = useState(false);

// rsa
  const [pValue, setPValue] = useState<number | null>(null);
  const [qValue, setQValue] = useState<number | null>(null);
  const [eValue, setEValue] = useState<number | null>(null);
  const [mValue, setMValue] = useState<number | null>(null);
   const [algorithmStep, setAlgorithmStep] = useState<
    "start" | "p" | "q" | "m" | "e" | "result">("start");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(""); 


  const directories = {
    root: ["ScryptoSim"],
    ScryptoSim: ["rsa",],
    rsa: ["input", "process", "output"],
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
      setOutput(["Type 'help' to see available commands."]);
    } else if (input.toLowerCase() === "ls") {
      setOutput((prevOutput) => [...prevOutput, `Listing contents of ${currentDir}:`, ...currentFolders]);
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
      ]);
    } else if (input.toLowerCase() === "npm run rsa" && path[path.length - 1] === "rsa") {
      setOutput((prevOutput) => [...prevOutput, "Starting RSA simulation..."]);
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'p':"]);
      setAlgorithmStep("p");
    } else {
      setOutput((prevOutput) => [...prevOutput, `'${input}' is not a recognized command.`]);
    }

    setInput(""); // Reset input field
  };

  const handleRSAInput = () => {
    const numInput = Number(input);

    if (algorithmStep === "p") {
      setOutput((prevOutput) => [...prevOutput, `You entered p = ${input}`]);
      setPValue(numInput);
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'q':"]);
      setAlgorithmStep("q");
    } else if (algorithmStep === "q") {
      setOutput((prevOutput) => [...prevOutput, `You entered q = ${input}`]);
      setQValue(numInput);
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'M':"]);
      setAlgorithmStep("m");
    } else if (algorithmStep === "m") {
      setOutput((prevOutput) => [...prevOutput, `You entered m = ${input}`]);
      setMValue(numInput);
      setOutput((prevOutput) => [...prevOutput, "Please enter the value for 'e' (must be greater than 1 and less than (p-1)*(q-1)):"]);
      setAlgorithmStep("e");
    } else if (algorithmStep === "e") {
      const e = numInput;

      if (e > 1 && e < (pValue! - 1) * (qValue! - 1)) {
        setEValue(e);
        setOutput((prevOutput) => [...prevOutput, `You entered e = ${e}`]);
        setOutput((prevOutput) => [...prevOutput, "Calculating RSA... Please wait."]);
        setLoading(true);
        setAlgorithmStep("result");

        setTimeout(() => {
          setLoading(false);

          const n = pValue! * qValue!;
          const phi = (pValue! - 1) * (qValue! - 1);
          const d = modInverse(e, phi);

          const ciphertext = modExp(mValue!, e, n);
          const decryptedMessage = modExp(ciphertext, d, n);

          setOutput((prevOutput) => [
            ...prevOutput,
            `n = p * q = ${n}`,
            `φ(n) = (p-1) * (q-1) = ${phi}`,
            `Public Key: (e = ${e}, n = ${n})`,
            `Private Key: (d = ${d}, n = ${n})`,
            `Encrypted Message (C) = ${ciphertext}`,
            `Decrypted Message (M) = ${decryptedMessage}`,
          ]);
        }, 2000);
      } else {
        setOutput((prevOutput) => [
          ...prevOutput,
          "Invalid value for e. Ensure that 1 < e < (p-1)*(q-1). Please enter a valid value for 'e':",
        ]);
      }
    }

    setInput(""); // Reset input field after handling
  };
  
  // Modular inverse function
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
  
  // Modular exponentiation function (a^b % m)
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

  const handleLogout = () => {
    // Arahkan ke halaman yang diinginkan setelah logout
    router.replace("/"); // Ganti '/halaman-setelah-logout' dengan URL tujuan
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ backgroundImage: "url('/walpeper3.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-black bg-opacity-55 text-[#00ff00] font-mono rounded-lg shadow-lg w-full max-w-3xl sm:w-full -mt-56">
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-t-lg">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="ml-auto text-gray-400 text-sm">ScryptoSim Terminal</span>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="absolute top-2 right-2 text-gray-200 hover:text-white text-sm px-2 py-1 rounded-full"
          >
            Logout
          </button>
        </div>

        <div className="absolute top-4 left-4 text-md text-gray-200">{time}</div>

        <div className="p-4" ref={terminalRef}>
          <div className="flex flex-col gap-1">
            {output.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
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
                  } else if (algorithmStep === "p" || algorithmStep === "q" || algorithmStep === "m" || algorithmStep === "e") {
                    handleRSAInput();
                  }
                }
              }}
              className="bg-transparent text-[#00ff00] w-full outline-none"
              placeholder="Type a command"
            />
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}

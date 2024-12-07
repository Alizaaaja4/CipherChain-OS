// pages/rsa.tsx
import { useState } from 'react';

const RSA = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [p, setP] = useState<number | string>('');
  const [q, setQ] = useState<number | string>('');
  const [message, setMessage] = useState<number | string>('');
  const [steps, setSteps] = useState<boolean>(false); // Flag to control when the RSA steps are displayed

  // Helper function to calculate modular exponentiation
  const modExp = (base: number, exp: number, mod: number): number => {
    return Math.pow(base, exp) % mod;
  };

  // Helper function to calculate modular inverse
  const modInverse = (a: number, m: number): number => {
    let [m0, x0, x1] = [m, 0, 1];
    while (a > 1) {
      let q = Math.floor(a / m);
      [m, a] = [a % m, m];
      [x0, x1] = [x1 - q * x0, x0];
    }
    if (x1 < 0) x1 += m0;
    return x1;
  };

  const handleSubmit = async () => {
    setSteps(true);
    const pVal = Number(p);
    const qVal = Number(q);

    // Step 1: Calculate n
    const n = pVal * qVal;
    setOutput(prev => [...prev, `Calculating n: n = p * q = ${pVal} * ${qVal} = ${n}`]);

    // Step 2: Calculate φ(n)
    const phiN = (pVal - 1) * (qVal - 1);
    setOutput(prev => [...prev, `Calculating φ(n): φ(n) = (p - 1) * (q - 1) = ${(pVal - 1)} * ${(qVal - 1)} = ${phiN}`]);

    // Step 3: Choose e
    const e = 17; // Commonly used value for e
    setOutput(prev => [...prev, `Choosing e: e = ${e} (commonly used prime)`]);

    // Step 4: Calculate d
    const d = modInverse(e, phiN);
    setOutput(prev => [...prev, `Calculating d: d = ${d} (modular multiplicative inverse of e mod φ(n))`]);

    // Step 5: Public and Private Keys
    setOutput(prev => [
      ...prev,
      `Public Key (e, n) = (${e}, ${n})`,
      `Private Key (d, n) = (${d}, ${n})`
    ]);

    // Step 6: Encrypting and Decrypting a message
    const plaintext = Number(message);
    const ciphertext = modExp(plaintext, e, n);
    const decrypted = modExp(ciphertext, d, n);

    setOutput(prev => [
      ...prev,
      `Encrypting message: Ciphertext c = m^e mod n = ${plaintext}^${e} mod ${n} = ${ciphertext}`,
      `Decrypting message: Decrypted message m = c^d mod n = ${ciphertext}^${d} mod ${n} = ${decrypted}`
    ]);
  };

  return (
    <div>
      <h1>RSA Simulation</h1>
      <div>
        <label>
          Enter p: 
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Enter q: 
          <input
            type="number"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Enter Message (m): 
          <input
            type="number"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSubmit}>Run Simulation</button>
      <div>
        {steps && (
          <div>
            {output.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RSA;

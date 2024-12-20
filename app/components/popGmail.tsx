import React, { useState, useEffect } from 'react';
import forge from 'node-forge';

interface PopGmailProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopGmail: React.FC<PopGmailProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(1);
  const [sender, setSender] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [encryptedMessage, setEncryptedMessage] = useState<string>('');
  const [decryptedMessage, setDecryptedMessage] = useState<string>('');

  const [privateKey, setPrivateKey] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<any>(null);

  useEffect(() => {
    const { pki } = forge;
    const { privateKey, publicKey } = pki.rsa.generateKeyPair(2048);
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
  }, []);

  const [sentTime, setSentTime] = useState<string>('');

  const handleSend = () => {
    if (!sender || !receiver || !message) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    const encrypted = publicKey.encrypt(message);
    setEncryptedMessage(forge.util.encode64(encrypted));
    setDecryptedMessage('');
    setSentTime(new Date().toLocaleString());
    alert("Pesan berhasil dikirim!");
  };

  const handleReceive = () => {
    if (!encryptedMessage) {
      alert("Pesan belum dienkripsi!");
      return;
    }
    try {
      const decodedMessage = forge.util.decode64(encryptedMessage);
      const decrypted = privateKey.decrypt(decodedMessage);
      setDecryptedMessage(decrypted);
      alert("Pesan berhasil diterima!");
    } catch {
      alert("Dekripsi gagal! Pesan mungkin rusak.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 -mt-[500px] p-4">
      <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full shadow-lg">
        <div className="flex items-center mb-4">
          <img
            src="/gmail.jfif"
            alt="Gmail Logo"
            className="h-10 mr-2 rounded-md"
          />
          <h2 className="text-xl font-bold text-green-500">Simulasi RSA</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-around mb-4 space-x-2 md:space-x-0 md:flex-row md:space-y-0 space-y-2">
          <button
            onClick={() => setActiveTab(1)}
            className={`w-full md:w-1/3 p-2 text-white ${activeTab === 1 ? 'bg-green-700' : 'bg-gray-800'} rounded`}
          >
            Tab 1: Pengirim
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`w-full md:w-1/3 p-2 text-white ${activeTab === 2 ? 'bg-green-700' : 'bg-gray-800'} rounded`}
          >
            Tab 2: Enkripsi
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`w-full md:w-1/3 p-2 text-white ${activeTab === 3 ? 'bg-green-700' : 'bg-gray-800'} rounded`}
          >
            Tab 3: Penerima
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-white">Dari (Pengirim):</label>
                  <input
                    type="email"
                    className="w-full mb-4 p-2 bg-gray-800 text-white border border-green-600 rounded"
                    placeholder="pengirim@gmail.com"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-white">Kepada (Penerima):</label>
                  <input
                    type="email"
                    className="w-full mb-4 p-2 bg-gray-800 text-white border border-green-600 rounded"
                    placeholder="penerima@gmail.com"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                </div>
              </div>

              <label className="block mb-2 text-white">Subjek:</label>
              <input
                type="text"
                className="w-full mb-4 p-2 bg-gray-800 text-white border border-green-600 rounded"
                placeholder="Subjek Pesan"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <label className="block mb-2 text-white">Pesan:</label>
              <textarea
                className="w-full mb-4 p-2 bg-gray-800 text-white border border-green-600 rounded"
                rows={4}
                placeholder="Tulis pesan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  className="w-full md:w-1/2 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleSend}
                >
                  Kirim Pesan
                </button>
                <button
                  className="w-full md:w-1/2 bg-black text-white px-4 py-2 rounded"
                  onClick={onClose}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h3 className="font-bold text-white">Proses Enkripsi</h3>
              <div className="p-2 bg-gray-800 rounded">
                <p><strong className="text-white">Pesan Terenkripsi:</strong></p>
                <p className="text-white break-words overflow-auto max-h-32">
                  {encryptedMessage ? encryptedMessage : "Pesan belum dienkripsi"}
                </p>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <h3 className="font-bold text-white">Proses Dekripsi</h3>

              <div className="p-2 bg-gray-800 rounded mb-4">
                <p><strong className="text-white">Pengirim: </strong>{sender ? sender : "Tidak ada pengirim"}</p>
                <p><strong className="text-white">Subjek: </strong>{subject ? subject : "Tidak ada subjek"}</p>
                <p><strong className="text-white">Pesan Dikirim Pada: </strong>{sentTime ? sentTime : "Waktu pengiriman belum tersedia"}</p>
              </div>

              <div className="p-2 bg-gray-800 rounded">
                <p><strong className="text-white">Pesan Didekripsi:</strong></p>
                <p className="text-white">{decryptedMessage ? decryptedMessage : "Pesan belum didekripsi"}</p>
              </div>

              <button
                className="w-full bg-green-600 text-white px-4 py-2 rounded mt-4"
                onClick={handleReceive}
              >
                Terima Pesan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopGmail;

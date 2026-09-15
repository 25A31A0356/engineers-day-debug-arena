import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  QrCode,
  Smartphone,
  Wifi,
  Wrench,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { PragatiLogo } from "@/components/PragatiLogo";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [networkIps, setNetworkIps] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch host LAN IP
  useEffect(() => {
    async function fetchNetworkInfo() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/network-ip");
        if (res.ok) {
          const data = await res.json();
          if (data.ips && data.ips.length > 0) {
            setNetworkIps(data.ips);
            const defaultPort = window.location.port || "3000";
            const lanUrl = `http://${data.ips[0]}:${defaultPort}`;
            setSelectedUrl(lanUrl);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch network IP, falling back to window.location", err);
      } finally {
        setIsLoading(false);
      }

      // Fallback to current browser origin
      const currentOrigin = window.location.origin;
      setSelectedUrl(currentOrigin);
    }

    if (isOpen) {
      fetchNetworkInfo();
    }
  }, [isOpen]);

  // Generate QR Code image when selected URL changes
  useEffect(() => {
    const activeUrl = customUrl.trim() || selectedUrl || window.location.origin;
    if (!activeUrl) return;

    QRCode.toDataURL(activeUrl, {
      width: isProjectorMode ? 600 : 380,
      margin: 2,
      color: {
        dark: "#050811",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code Generation Error:", err);
      });
  }, [selectedUrl, customUrl, isProjectorMode]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const activeUrl = customUrl.trim() || selectedUrl;
    try {
      await navigator.clipboard.writeText(activeUrl);
      setIsCopied(true);
      playCorrectSound();
      toast.success("Arena Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownload = () => {
    playClickSound();
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `Engineering-Olympics-QR-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    toast.success("QR Code image downloaded for projector/posters!");
  };

  const activeUrl = customUrl.trim() || selectedUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full overflow-hidden rounded-[32px] border border-[#ffb800]/40 bg-[#0d121d] shadow-2xl shadow-black/80 transition-all ${
          isProjectorMode
            ? "max-w-4xl max-h-[95vh] p-8 sm:p-12 text-center"
            : "max-w-2xl max-h-[92vh] p-6 sm:p-8"
        }`}
      >
        {/* Background Ambient Aura */}
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[#ffb800]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <PragatiLogo variant="header" size="sm" subtitleText="ARENA GATEWAY · MULTI-DEVICE LAN" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setIsProjectorMode(!isProjectorMode);
              }}
              title={isProjectorMode ? "Exit Projector Mode" : "Full-Screen Projector Mode"}
              className="grid size-9 place-items-center rounded-xl border border-white/10 text-[#8ea0b5] transition hover:border-[#ffb800]/50 hover:text-white"
            >
              {isProjectorMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              aria-label="Close QR Modal"
              className="grid size-9 place-items-center rounded-xl border border-white/10 text-[#8ea0b5] transition hover:border-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`relative mt-6 overflow-y-auto ${
            isProjectorMode
              ? "flex flex-col items-center justify-center space-y-6"
              : "grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center"
          }`}
        >
          {/* QR Code Container */}
          <div className="flex flex-col items-center text-center">
            <div className="relative rounded-3xl border-2 border-[#ffb800] bg-white p-4 shadow-[0_0_35px_rgba(255,184,0,0.3)]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Engineering Olympics Access QR Code"
                  className={`rounded-2xl transition-all ${
                    isProjectorMode ? "size-72 sm:size-84" : "size-56 sm:size-64"
                  }`}
                />
              ) : (
                <div className="grid size-56 place-items-center bg-slate-100 rounded-2xl text-slate-400">
                  <span className="font-mono text-xs">Generating QR...</span>
                </div>
              )}

              {/* PU Mechanical Overlay Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[#07090e] bg-[#ffb800] px-3.5 py-1 font-orbitron text-[10px] font-black uppercase tracking-wider text-[#07090e] shadow-md">
                <Wrench size={12} className="animate-gear-slow" /> PU MECH
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-3.5 py-1 font-mono text-[10px] font-bold text-[#00e5ff]">
                <Wifi size={12} /> MG-7 Core Block · Wi-Fi / Hotspot Access
              </span>
              <p className="mt-2 font-mono text-xs text-[#9eb0c6] max-w-xs break-all">
                {activeUrl}
              </p>
            </div>
          </div>

          {/* Right Column: Connection Controls & Instructions */}
          {!isProjectorMode && (
            <div className="space-y-5">
              {/* Network IP Selector */}
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#8696ab]">
                  Detected Local Network Addresses:
                </label>
                <div className="space-y-2">
                  {networkIps.length > 0 ? (
                    networkIps.map((ip) => {
                      const port = window.location.port || "3000";
                      const url = `http://${ip}:${port}`;
                      const isSelected = selectedUrl === url && !customUrl;
                      return (
                        <button
                          key={ip}
                          onClick={() => {
                            playClickSound();
                            setSelectedUrl(url);
                            setCustomUrl("");
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? "border-[#ffb800] bg-[#ffb800]/10 shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                              : "border-white/[0.08] bg-[#05070c] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Wifi size={15} className={isSelected ? "text-[#ffb800]" : "text-[#68798d]"} />
                            <div>
                              <span className="block font-mono text-xs font-bold text-white">
                                {url}
                              </span>
                              <span className="block font-mono text-[9px] text-[#718296]">
                                Wi-Fi / LAN Adapter ({ip})
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check size={16} className="text-[#ffb800]" />}
                        </button>
                      );
                    })
                  ) : (
                    <button
                      onClick={() => setSelectedUrl(window.location.origin)}
                      className="flex w-full items-center justify-between rounded-xl border border-[#ffb800] bg-[#ffb800]/10 p-3 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wifi size={15} className="text-[#ffb800]" />
                        <span className="font-mono text-xs font-bold text-white">
                          {window.location.origin}
                        </span>
                      </div>
                      <Check size={16} className="text-[#ffb800]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions 3-Step Guide */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#05070c] p-4">
                <strong className="block font-orbitron text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                  How Students Join From Any Device:
                </strong>
                <ol className="space-y-2 text-xs text-[#8ea0b5]">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#ffb800]">1.</span>
                    <span>Connect smartphone/laptop to the same Wi-Fi or lab hotspot.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#ffb800]">2.</span>
                    <span>Open Phone Camera or Google Lens and scan the QR code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#ffb800]">3.</span>
                    <span>Enter Student Roll Number to receive your unique diagnostic code & begin!</span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffb800] to-[#ffd700] py-3 px-4 font-orbitron text-xs font-bold text-[#07090e] shadow-[0_8px_20px_rgba(255,184,0,0.25)] transition hover:shadow-[0_12px_28px_rgba(255,184,0,0.35)] active:scale-98"
                >
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                  {isCopied ? "LINK COPIED!" : "COPY ARENA LINK"}
                </button>

                <button
                  onClick={handleDownload}
                  title="Download QR code image for posters or lab display"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] py-3 px-4 font-mono text-xs font-semibold text-white transition hover:border-[#ffb800]/40 hover:bg-[#ffb800]/10"
                >
                  <Download size={15} /> Save QR Image
                </button>
              </div>
            </div>
          )}

          {/* Projector Mode Footer */}
          {isProjectorMode && (
            <div className="max-w-lg space-y-4">
              <p className="font-orbitron text-lg font-bold text-white">
                Open Camera & Scan to Launch Your Rig Station
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl bg-[#ffb800] px-5 py-2.5 font-orbitron text-xs font-bold text-[#07090e]"
                >
                  <Copy size={14} /> Copy Direct Link
                </button>
                <button
                  onClick={() => setIsProjectorMode(false)}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-mono text-xs text-white"
                >
                  <Minimize2 size={14} /> Normal View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

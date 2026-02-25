import React, { useState } from "react";
import { X, Share2, Copy, Check, MessageCircle } from "lucide-react";
import Button from "./Button";

const ShareModal = ({ isOpen, onClose, inviteLink, groupName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my F1 group: ${groupName}`,
          text: `Join my private F1 prediction group!`,
          url: inviteLink,
        });
      } catch {
        // user cancelled
      }
    }
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `Join my F1 prediction group: ${inviteLink}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Share2 className="text-[#c1a362]" />
          <h2 className="text-xl font-semibold">Invite Friends</h2>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          Share this link to invite friends to your private group.
        </p>

        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-3 break-all text-sm mb-6">
          {inviteLink}
        </div>

        <div className="space-y-3">
          <Button onClick={handleCopy}>
            {copied ? (
              <span className="flex items-center gap-2">
                <Check size={16} /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy size={16} /> Copy Link
              </span>
            )}
          </Button>

          {navigator.share && (
            <Button onClick={handleNativeShare}>
              <span className="flex items-center gap-2">
                <Share2 size={16} /> Share via Apps
              </span>
            </Button>
          )}

          <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
            <Button>
              <span className="flex items-center gap-2">
                <MessageCircle size={16} /> Share on WhatsApp
              </span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
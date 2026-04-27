import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa6";
import type { SocialPlatform } from "@/types/site-config";
import type { ComponentType } from "react";

const ICONS: Record<SocialPlatform, ComponentType<{ size?: number | string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
};

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

export function SocialIcon({ platform, size = 18 }: { platform: SocialPlatform; size?: number }) {
  const Icon = ICONS[platform];
  return <Icon size={size} />;
}

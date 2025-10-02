"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";
import { formatCurrency } from "@/app/_utils/helper";
import toast from "react-hot-toast";

const ADDRESS_LINE_1 = "No. 714, KandyRoad, Thorana Junction,";
const ADDRESS_LINE_2 = "Kelaniya, Sri Lanka";
const PHONE_NUMBER = "076 763 6596"; // <- edit here
const LOGO_URL = "/logo/logo.png"; // /public/logo/logo.png

export default function BuildPdfButton({
  parts = [],
  total = 0,
  enabled = false,
  fileName = "pc-build-summary.pdf",
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    try {
      setDownloading(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const marginL = 14;
      const marginR = 14;
      const priceX = pageW - marginR;

      const minNameX = 60;
      const pad = 2;

      // helper: load image to preserve aspect ratio
      async function loadImage(url) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      }

      // ---------- HEADER ----------
      let topY = 12;

      // Logo (kept ratio)
      try {
        const img = await loadImage(LOGO_URL);
        const maxW = 36,
          maxH = 18;
        const ratio = img.width / img.height;
        let w = maxW,
          h = w / ratio;
        if (h > maxH) {
          h = maxH;
          w = h * ratio;
        }
        doc.addImage(img, "PNG", marginL, topY, w, h);
      } catch {}

      // Address + phone (right)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const addrX = pageW - marginR;
      const lh = 5;
      let ay = topY + 2;
      const headerLines = [
        ADDRESS_LINE_1,
        ADDRESS_LINE_2,
        `Contact No: ${PHONE_NUMBER}`,
      ];
      headerLines.forEach((line) => {
        doc.text(line, addrX, ay, { align: "right" });
        ay += lh;
      });
      const addressBottomY = ay - lh;

      // Title (centered) with gap under address
      const minGap = 4;
      let titleY = Math.max(topY + 10, addressBottomY + minGap);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("PC Build Summary", pageW / 2, titleY, { align: "center" });

      // Date + divider
      let y = titleY + 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleString()}`, marginL, y);

      y += 4;
      doc.setLineWidth(0.5);
      doc.line(marginL, y, pageW - marginR, y);
      y += 10;

      // ---------- ITEMS ----------
      parts.forEach(({ label, item }, idx) => {
        const name = item?.name || "-";
        const price = item?.finalPrice ?? item?.price ?? 0;

        doc.setFont("helvetica", "bold");
        const labelText = String(label);
        doc.text(labelText, marginL, y);

        const labelW = doc.getTextWidth(labelText);
        const nameX = Math.max(minNameX, marginL + labelW + pad);

        doc.setFont("helvetica", "normal");
        const maxNameWidth = priceX - nameX - 2;
        const wrappedName = doc.splitTextToSize(name, maxNameWidth);
        doc.text(wrappedName, nameX, y);

        doc.text(formatCurrency(price), priceX, y, { align: "right" });

        const blockHeight = Math.max(8, wrappedName.length * 6 + 2);
        y += blockHeight;

        if (y > pageH - 20 && idx < parts.length - 1) {
          doc.addPage();
          y = 20;
        }
      });

      // ---------- TOTAL ----------
      y += 6;
      doc.setLineWidth(0.3);
      doc.line(marginL, y, pageW - marginR, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Total", marginL, y);
      doc.text(formatCurrency(total), priceX, y, { align: "right" });

      doc.save(fileName);
      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Did you install 'jspdf'?");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button
      buttonType="button"
      variant="primary"
      className="w-full"
      disabled={!enabled || downloading}
      onClick={handleDownload}
    >
      {downloading ? "Generating…" : "Download PDF"}
    </Button>
  );
}

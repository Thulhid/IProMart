"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";
import { formatCurrency } from "@/app/_utils/helper";
import toast from "react-hot-toast";

const WEBSITE = "www.ipromart.lk";
const COMPANY_NAME = "I Pro Mart (PVT) LTD"; // stays
const ADDRESS_LINE_1 = "No. 714, KandyRoad, Thorana Junction,";
const ADDRESS_LINE_2 = "Kelaniya, Sri Lanka";
const PHONE_NUMBER = "076 763 6596";
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
      const topMargin = 12;
      const bottomMargin = 20;

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
      let topY = topMargin;

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

      // Company + Address (right)
      const addrX = pageW - marginR;
      const lh = 5;
      let ay = topY + 2;

      // Company (bold) ABOVE address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(COMPANY_NAME, addrX, ay, { align: "right" });
      ay += lh;

      // Address + phone + website
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      [
        ADDRESS_LINE_1,
        ADDRESS_LINE_2,
        `Contact No: ${PHONE_NUMBER}`,
        WEBSITE,
      ].forEach((line) => {
        doc.text(line, addrX, ay, { align: "right" });
        ay += lh;
      });
      const addressBottomY = ay - lh;

      // ---------- TITLE (left-aligned, blue-700) ----------
      const minGap = 4;
      let titleY = Math.max(topY + 10, addressBottomY + minGap);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(29, 78, 216); // Tailwind blue-700
      doc.text("PC Build Quotation", marginL, titleY); // left aligned
      doc.setTextColor(0, 0, 0); // reset

      // Date under the title, RIGHT-ALIGNED
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const dateY = titleY + 6;
      doc.text(`Date: ${new Date().toLocaleString()}`, pageW - marginR, dateY, {
        align: "right",
      });

      // Divider below the date
      let y = dateY + 6;
      doc.setLineWidth(0.5);
      doc.line(marginL, y, pageW - marginR, y);
      y += 8;

      // ---------- TABLE LAYOUT ----------
      // Columns: Component | Item | Price
      const tableX = marginL;
      const tableWidth = pageW - marginL - marginR;

      const col1W = 40; // Component
      const col3W = 32; // Price
      const col2W = tableWidth - col1W - col3W; // Item (flex)
      const headerH = 8;
      const minRowH = 8;
      const cellPadX = 2;
      const textLH = 5;

      function ensureSpace(rowHeight) {
        if (y + rowHeight > pageH - bottomMargin) {
          doc.addPage();
          y = 20;
          drawHeaderRow();
        }
      }

      function drawHeaderRow() {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setDrawColor(0);
        doc.setFillColor(245, 245, 245);
        doc.rect(tableX, y, tableWidth, headerH, "F");
        doc.rect(tableX, y, col1W, headerH);
        doc.rect(tableX + col1W, y, col2W, headerH);
        doc.rect(tableX + col1W + col2W, y, col3W, headerH);

        doc.text("Component", tableX + cellPadX, y + headerH - 3);
        doc.text("Item", tableX + col1W + cellPadX, y + headerH - 3);
        doc.text(
          "Price",
          tableX + col1W + col2W + col3W - cellPadX,
          y + headerH - 3,
          {
            align: "right",
          },
        );
        y += headerH;
      }

      function drawDataRow({ label, name, price }) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const wrappedName = doc.splitTextToSize(
          name || "-",
          col2W - cellPadX * 2,
        );
        const lines = Array.isArray(wrappedName) ? wrappedName.length : 1;
        const rowH = Math.max(minRowH, lines * textLH);

        ensureSpace(rowH);

        doc.rect(tableX, y, col1W, rowH);
        doc.rect(tableX + col1W, y, col2W, rowH);
        doc.rect(tableX + col1W + col2W, y, col3W, rowH);

        const textY = y + Math.min(5, rowH - 3);
        doc.text(String(label || "-"), tableX + cellPadX, textY);
        doc.text(wrappedName, tableX + col1W + cellPadX, textY);
        doc.text(
          formatCurrency(price ?? 0),
          tableX + col1W + col2W + col3W - cellPadX,
          textY,
          { align: "right" },
        );

        y += rowH;
      }

      function drawTotalRow(totalAmount) {
        const rowH = minRowH + 2;
        ensureSpace(rowH);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);

        const leftSpanW = col1W + col2W;
        doc.rect(tableX, y, leftSpanW, rowH);
        doc.rect(tableX + leftSpanW, y, col3W, rowH);

        doc.text("Total", tableX + leftSpanW - cellPadX, y + rowH - 3, {
          align: "right",
        });
        doc.text(
          formatCurrency(totalAmount),
          tableX + leftSpanW + col3W - cellPadX,
          y + rowH - 3,
          { align: "right" },
        );

        y += rowH;
      }

      // Render table
      drawHeaderRow();
      parts.forEach(({ label, item }) => {
        const name = item?.name || "-";
        const price = item?.finalPrice ?? item?.price ?? 0;
        drawDataRow({ label, name, price });
      });
      drawTotalRow(total);

      // Save
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

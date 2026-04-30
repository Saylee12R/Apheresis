package com.bloodbank.util;

import com.bloodbank.entity.Donation;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class PdfGenerationUtil {

    // ── Palette ───────────────────────────────────────────────────────────────
    private static final BaseColor RED_DARK   = new BaseColor(163, 22, 22);
    private static final BaseColor RED_MED    = new BaseColor(214, 40, 40);
    private static final BaseColor GOLD       = new BaseColor(180, 140, 50);
    private static final BaseColor BLUSH      = new BaseColor(248, 200, 220);
    private static final BaseColor CREAM      = new BaseColor(255, 248, 250);
    private static final BaseColor DARK_TEXT  = new BaseColor(50, 30, 30);
    private static final BaseColor MUTED_TEXT = new BaseColor(130, 90, 90);

    public byte[] generateDonationCertificate(Donation donation) {
        // A4 Landscape: width=841.89, height=595.28
        Document doc = new Document(PageSize.A4.rotate(), 0, 0, 0, 0);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            doc.open();

            PdfContentByte cb = writer.getDirectContent();
            float W = doc.getPageSize().getWidth();   // 841.89
            float H = doc.getPageSize().getHeight();  // 595.28

            // ── 1. Cream background ─────────────────────────────────────────
            drawRect(cb, CREAM, 0, 0, W, H);

            // ── 2. Top blush header band (y=H-100 to y=H) ──────────────────
            drawRect(cb, BLUSH, 0, H - 110, W, 110);

            // ── 3. Bottom blush footer band ─────────────────────────────────
            drawRect(cb, BLUSH, 0, 0, W, 70);

            // ── 4. Outer red border ─────────────────────────────────────────
            drawBorder(cb, RED_DARK, 12, 12, W - 24, H - 24, 3f);

            // ── 5. Inner gold border ────────────────────────────────────────
            drawBorder(cb, GOLD, 20, 20, W - 40, H - 40, 1f);

            // ── 6. Thin red line below header band ─────────────────────────
            cb.setColorStroke(RED_DARK);
            cb.setLineWidth(1.5f);
            cb.moveTo(40, H - 110);
            cb.lineTo(W - 40, H - 110);
            cb.stroke();

            // ── 7. Thin red line above footer band ─────────────────────────
            cb.moveTo(40, 70);
            cb.lineTo(W - 40, 70);
            cb.stroke();

            // ── 8. TITLE in header band ─────────────────────────────────────
            // "CERTIFICATE OF" on first line, "APPRECIATION" on second line
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 32, Font.BOLD, RED_DARK);
            showCenteredText(cb, "CERTIFICATE OF APPRECIATION", titleFont, W, H - 62);

            Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.ITALIC, GOLD);
            showCenteredText(cb, "\u2014  In Recognition of a Life-Saving Blood Donation  \u2014", subtitleFont, W, H - 88);

            // ── 9. Gold divider line ────────────────────────────────────────
            drawHLine(cb, GOLD, 80, W - 80, H - 165, 0.8f);

            // ── 10. "presented to" ──────────────────────────────────────────
            Font presentedFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, MUTED_TEXT);
            showCenteredText(cb, "This certificate is proudly presented to", presentedFont, W, H - 205);

            // ── 11. Donor name ──────────────────────────────────────────────
            Font nameFont = new Font(Font.FontFamily.HELVETICA, 38, Font.BOLDITALIC, RED_DARK);
            showCenteredText(cb, donation.getDonor().getUsername(), nameFont, W, H - 265);

            // ── 12. Gold divider below name ─────────────────────────────────
            drawHLine(cb, GOLD, 80, W - 80, H - 290, 0.8f);

            // ── 13. Donation detail line ────────────────────────────────────
            Font detailFont = new Font(Font.FontFamily.HELVETICA, 13, Font.NORMAL, DARK_TEXT);
            String detailLine = "For the generous donation of  "
                    + donation.getBloodGroup() + "  ("
                    + donation.getBloodComponentType() + ")  blood  on  "
                    + donation.getDonationDate();
            showCenteredText(cb, detailLine, detailFont, W, H - 330);

            // ── 14. Quantity badge ──────────────────────────────────────────
            Font qtyFont = new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD, RED_MED);
            showCenteredText(cb, "Quantity Donated:  " + donation.getQuantityMl() + " ml", qtyFont, W, H - 360);

            // ── 15. Red divider ─────────────────────────────────────────────
            drawHLine(cb, RED_DARK, 180, W - 180, H - 390, 0.5f);

            // ── 16. Appreciation quote ──────────────────────────────────────
            Font quoteFont = new Font(Font.FontFamily.HELVETICA, 11, Font.ITALIC, MUTED_TEXT);
            showCenteredText(cb, "\u201cYour act of kindness has given someone another chance at life.", quoteFont, W, H - 420);
            showCenteredText(cb, "Every drop you gave carries hope, strength, and love.\u201d", quoteFont, W, H - 440);

            // ── 17. Footer org name ─────────────────────────────────────────
            Font orgFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, GOLD);
            showCenteredText(cb, "\u2756  APHERESIS BLOOD BANK  \u2756", orgFont, W, 28);

            // ── 18. Footer date on right ────────────────────────────────────
            Font dateFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, MUTED_TEXT);
            showRightText(cb, "Date: " + donation.getDonationDate(), dateFont, W - 40, 28);

            doc.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF certificate", e);
        }

        return out.toByteArray();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void drawRect(PdfContentByte cb, BaseColor color, float x, float y, float w, float h) {
        cb.setColorFill(color);
        cb.rectangle(x, y, w, h);
        cb.fill();
    }

    private void drawBorder(PdfContentByte cb, BaseColor color, float x, float y, float w, float h, float lineWidth) {
        cb.setColorStroke(color);
        cb.setLineWidth(lineWidth);
        cb.rectangle(x, y, w, h);
        cb.stroke();
    }

    private void drawHLine(PdfContentByte cb, BaseColor color, float x1, float x2, float y, float lineWidth) {
        cb.setColorStroke(color);
        cb.setLineWidth(lineWidth);
        cb.moveTo(x1, y);
        cb.lineTo(x2, y);
        cb.stroke();
    }

    private void showCenteredText(PdfContentByte cb, String text, Font font, float pageWidth, float y) {
        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase(text, font), pageWidth / 2, y, 0);
    }

    private void showRightText(PdfContentByte cb, String text, Font font, float x, float y) {
        ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                new Phrase(text, font), x, y, 0);
    }
}

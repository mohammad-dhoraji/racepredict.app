import { toPng } from "html-to-image";

const waitForImages = async (node) => {
  const images = node.querySelectorAll("img");

  await Promise.all(
    Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
};

export const exportTierList = async (ref) => {
  if (!ref.current) return null;

  // Clone node for clean capture
  const clonedNode = ref.current.cloneNode(true);

  clonedNode.style.position = "fixed";
  clonedNode.style.top = "0";
  clonedNode.style.left = "0";
  clonedNode.style.opacity = "1";
  clonedNode.style.pointerEvents = "none";
  clonedNode.style.zIndex = "9999";

  document.body.appendChild(clonedNode);

  try {
    // Wait for fonts including custom FormulaOne font
    if (document.fonts) {
      await document.fonts.ready;
      // Ensure FormulaOne font is loaded
      await document.fonts.load('bold 36px FormulaOne');
      await document.fonts.load('normal 36px FormulaOne');
    }


    // Wait for images
    await waitForImages(clonedNode);

    // Force layout & paint
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => setTimeout(r, 150));

    const dataUrl = await toPng(clonedNode, {
      width: 1080,
      height: 1400,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#0a0a0a",
      skipFonts: false,
    });

    return dataUrl;
  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed. Likely due to image CORS issues.");
    return null;
  } finally {
    // Cleanup
    if (clonedNode.parentNode) {
      document.body.removeChild(clonedNode);
    }
  }
};

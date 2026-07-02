// Wrapper ES module -> expose pdf.js sur window.pdfjsLib pour usage depuis app.js (script classique)
import * as pdfjsLib from './pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./pdf.worker.min.mjs', import.meta.url).href;
window.pdfjsLib = pdfjsLib;
window.dispatchEvent(new Event('pdfjs-ready'));

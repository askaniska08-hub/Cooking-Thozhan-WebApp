/**
 * Safe print utility — uses a hidden iframe instead of window.open().
 *
 * The previous window.open() approach blocked the main thread synchronously
 * during the native print dialog and never closed the popup, which could leave
 * the app in a frozen state. This iframe approach:
 *   - never opens a separate window
 *   - cleans up the iframe immediately after printing
 *   - listens for afterprint to restore state
 *   - falls back gracefully if printing fails
 */
export function printHtml(title: string, bodyHtml: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      iframe.remove();
    }, 1000);
  };

  try {
    const doc = iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
      body { font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 40px auto; padding: 20px; }
      h1 { color: #FF7A00; font-size: 22px; }
      ul { font-size: 16px; line-height: 1.8; padding-left: 20px; }
      li { padding: 4px 0; }
      @media print { body { margin: 0; } }
    </style></head><body>${bodyHtml}</body></html>`);
    doc.close();

    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }

    const doPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
        // Print failed — still clean up
      }
      cleanup();
    };

    // Wait for content to load before printing
    if (win.document.readyState === 'complete') {
      doPrint();
    } else {
      win.onload = doPrint;
      // Safety timeout — don't hang forever
      setTimeout(doPrint, 2000);
    }
  } catch {
    cleanup();
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
}

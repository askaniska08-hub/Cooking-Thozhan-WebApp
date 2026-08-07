import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Printer, Share2, Download, Check, ShoppingCart } from 'lucide-react';
import type { ShoppingListItem } from '@/types';

interface ShoppingListProps {
  items: ShoppingListItem[];
}

export function ShoppingList({ items }: ShoppingListProps) {
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const buildText = () => {
    const lines = ['🛒 Cooking Thozhan — Shopping List', ''];
    items.forEach((item) => {
      lines.push(`• ${item.ingredient} × ${item.totalQuantity}  (for ${item.recipeCount} ${item.recipeCount === 1 ? 'recipe' : 'recipes'})`);
    });
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may be blocked */ }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Shopping List</title><style>body{font-family:sans-serif;max-width:500px;margin:40px auto;padding:20px}h1{color:#FF7A00}li{padding:6px 0;font-size:16px}</style></head><body><h1>🛒 Shopping List</h1><ul>${items.map((i) => `<li><b>${i.ingredient}</b> — ${i.totalQuantity} (${i.recipeCount} ${i.recipeCount === 1 ? 'recipe' : 'recipes'})</li>`).join('')}</ul></body></html>`);
    w.document.close();
    w.print();
  };

  const handleShare = async () => {
    const text = buildText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Shopping List', text }); } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([buildText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
    >
      <div className="glass-strong rounded-3xl p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink dark:text-white">
            <ShoppingCart size={20} className="text-primary" /> Smart Shopping List
          </h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {items.length} items
          </span>
        </div>

        {/* Actions */}
        <div className="mb-4 flex flex-wrap gap-2">
          <ActionBtn onClick={handleCopy} icon={copied ? Check : Copy} label={copied ? 'Copied!' : 'Copy'} active={copied} />
          <ActionBtn onClick={handlePrint} icon={Printer} label="Print" />
          <ActionBtn onClick={handleShare} icon={Share2} label="Share" />
          <ActionBtn onClick={handleDownload} icon={Download} label="Download" />
        </div>

        {/* List */}
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.ingredient}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-sm">
                  🥬
                </span>
                <div>
                  <p className="text-sm font-bold text-ink dark:text-white">{item.ingredient}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {item.recipeCount} {item.recipeCount === 1 ? 'recipe' : 'recipes'}
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                {item.totalQuantity}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, active }: { onClick: () => void; icon: typeof Copy; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95 ${
        active
          ? 'bg-accent text-white shadow-glow-accent'
          : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-gray-300'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

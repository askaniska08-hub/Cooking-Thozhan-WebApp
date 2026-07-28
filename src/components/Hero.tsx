import { motion } from 'framer-motion';
import { ChefHat, ArrowRight, Sparkles, MessageCircle, UtensilsCrossed } from 'lucide-react';
import { RippleButton } from './ui/RippleButton';
import { ChefTara } from './ChefTara';
import { RECIPES } from '@/data/recipes';
import { INGREDIENTS } from '@/data/ingredients';

const recipeCount = `${RECIPES.length}+`;
const categoryCount = `${new Set(RECIPES.map((r) => r.category)).size}+`;
const ingredientCount = `${INGREDIENTS.length}+`;

interface HeroProps {
  onStart: () => void;
  onAskTara: () => void;
}

export function Hero({ onStart, onAskTara }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-10 sm:px-6 sm:pt-16">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 pb-10 lg:grid-cols-2 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles size={14} /> AI-Powered Smart Recipe Finder
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl"
          >
            Cooking <span className="text-primary">Thozhan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 sm:text-sm"
          >
            Your Smart Kitchen Companion
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 font-display text-2xl italic font-semibold leading-tight tracking-[0.01em] text-ink dark:text-white sm:text-3xl"
          >
            Why fear when your{' '}
            <span className="italic text-[#4ADE80] [text-shadow:0_0_22px_rgba(74,222,128,0.55)]">
              THOZHAN
            </span>{' '}
            is here!
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mx-auto mt-3 h-0.5 w-32 origin-left rounded-full bg-gradient-to-r from-[#4ADE80] to-transparent lg:mx-0"
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            whileHover={{ y: -3 }}
            className="group/card mx-auto mt-6 flex max-w-xl items-center gap-4 rounded-[1.25rem] border border-[#4ADE80]/20 bg-[#4ADE80]/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#4ADE80]/40 hover:shadow-[0_8px_30px_-8px_rgba(74,222,128,0.3)] dark:bg-[#0a1f0a]/40 lg:mx-0"
          >
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#4ADE80]/30 opacity-60 blur-lg transition-opacity duration-300 group-hover/card:opacity-100" />
              <div className="relative grid h-12 w-12 place-items-center rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 transition-transform duration-300 group-hover/card:scale-110">
                <UtensilsCrossed size={22} className="text-[#4ADE80]" />
              </div>
            </div>
            <p className="text-left text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              Tell us what ingredients you have, we&apos;ll instantly discover the best recipes you can prepare with what&apos;s already in your kitchen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <RippleButton onClick={onStart} className="btn-primary px-7 py-3.5 text-base">
              <ChefHat size={20} /> Start Cooking
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </RippleButton>
            <RippleButton onClick={onAskTara} className="btn-ghost border border-primary/30 px-6 py-3.5 text-base hover:bg-primary/10">
              <MessageCircle size={20} /> Ask Chef Tara
            </RippleButton>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-3 lg:mx-0"
          >
            {[
              { n: recipeCount, l: 'Recipes' },
              { n: ingredientCount, l: 'Ingredients' },
              { n: categoryCount, l: 'Categories' },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-3 py-3 text-center">
                <dt className="font-display text-2xl font-extrabold text-primary">{s.n}</dt>
                <dd className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Chef Tara illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto aspect-[5/6] w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-cream to-accent/20 blur-2xl" />
          <div className="glass-strong relative h-full overflow-hidden rounded-[2.5rem] shadow-card">
            <ChefTara />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-ink shadow-soft dark:bg-white/10 dark:text-white">
              Chef Tara · your AI cooking buddy
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

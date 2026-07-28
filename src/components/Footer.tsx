import { Heart, Sparkles, ChefHat, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white/50 dark:border-white/10 dark:bg-white/5">

      {/* ===== Meet the Creator ===== */}
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="group relative mx-auto max-w-2xl"
        >
          {/* Ambient glow layers */}
          <div className="pointer-events-none absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#FF6B00]/30 via-transparent to-[#FF6B00]/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-[#FF6B00]/8 via-transparent to-amber-500/5" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#141414] shadow-[0_0_60px_-15px_rgba(255,107,0,0.25)] transition-all duration-500 group-hover:shadow-[0_0_80px_-10px_rgba(255,107,0,0.4)] group-hover:-translate-y-1">

            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent" />

            {/* Subtle interior grid pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)',
              }}
            />

            <div className="relative px-8 pb-10 pt-10 text-center sm:px-12">

              {/* "About" badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#FF6B00]"
              >
                <ChefHat size={12} />
                The Mind Behind the Magic
              </motion.span>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Meet the Creator
              </motion.h2>

              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative mx-auto mt-8 h-28 w-28"
              >
                {/* Animated spinning gradient ring */}
                <motion.span
                  className="absolute -inset-[3px] rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #FF6B00, #FFB347, #FF6B00, #E64A00, #FF6B00)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner mask to create ring effect */}
                <span className="absolute inset-[3px] rounded-full bg-[#141414]" />
                {/* Soft glow pulse behind avatar */}
                <motion.span
                  className="absolute -inset-3 rounded-full bg-[#FF6B00]/25 blur-xl"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Photo */}
                <div className="relative h-full w-full overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-[1.04]">
                  <img
                    src="/images/Profile_2.jpg"
                    alt="Kaniska, creator of Cooking Thozhan"
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    width={112}
                    height={112}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1';
                        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112"><circle cx="56" cy="56" r="56" fill="#FF6B00"/><circle cx="56" cy="42" r="18" fill="white"/><path d="M56 66c-14 0-26 8-26 22v0h52v0c0-14-12-22-26-22z" fill="white"/></svg>'
                        );
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="mt-6 text-base font-semibold text-gray-200"
              >
                Hey folks!! I&apos;m{' '}
                <span className="bg-gradient-to-r from-[#FF6B00] to-amber-400 bg-clip-text font-extrabold italic text-transparent">
                  Kaniska
                </span>
                .
              </motion.p>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.38 }}
                className="mx-auto mt-4 max-w-lg text-balance text-sm leading-[1.8] text-gray-400"
              >
                I built Cooking Thozhan with a simple idea: great meals shouldn&apos;t be complicated.
                Cooking Thozhan helps in solving everyday kitchen dilemmas and helps anyone transform
                basic ingredients into incredible meals. Whether your fridge is full or almost empty,
                I&apos;m here to help you turn everyday ingredients into delicious dishes.
              </motion.p>

              {/* Divider */}
              <div className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#FF6B00]/40 to-transparent" />

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.46 }}
                className="mt-6 font-display text-xl font-bold tracking-tight text-[#FF6B00] sm:text-2xl"
              >
                Enjoy your meal!
              </motion.p>

</div>

            {/* Bottom accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* ===== Footer links ===== */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo size={48} />
              <span className="font-display text-lg font-extrabold text-ink dark:text-white">
                Cooking <span className="text-primary">Thozhan</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              No more wondering what to cook. Just pick your ingredients, and let Cooking Thozhan find the perfect recipe for you.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles size={13} /> AI-Powered Recipe Matching
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Features</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Smart ingredient picker</li>
              <li>Match percentage scoring</li>
              <li>Shopping list generator</li>
              <li>Favourites &amp; history</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>🥕 Vegetables</li>
              <li>🍚 Staples &amp; Dal</li>
              <li>🥛 Dairy &amp; Eggs</li>
              <li>🌿 Herbs &amp; Spices</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400 sm:flex-row">
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart size={14} className="fill-red-500 text-red-500" /> by Thozhan
          </p>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Cooking Thozhan</span>
            <a href="#top" className="inline-flex items-center gap-1.5 hover:text-primary">
              <Code2 size={15} /> Built with React + Vite
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { RECIPES } from '@/data/recipes';
import { INGREDIENTS, PANTRY_STAPLES } from '@/data/ingredients';
import { isKnownIngredient, normalizeIngredient, isIngredientAvailable } from '@/utils';
import type { Difficulty } from '@/types';

export interface ValidationIssue {
  type: 'error' | 'warning';
  recipeId?: string;
  message: string;
}

const VALID_DIFFICULTIES = new Set<Difficulty>(['Easy', 'Medium', 'Hard']);
const VALID_MEALS = new Set(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Side Dish']);

/**
 * Validate every recipe against the master INGREDIENTS list and the Recipe schema.
 * Runs at app startup in development and logs a full report to the console.
 */
export function validateRecipes(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const recipe of RECIPES) {
    const id = recipe.id ?? '(missing)';

    // --- ID checks ---
    if (!recipe.id) {
      issues.push({ type: 'error', message: 'Recipe missing id' });
      continue;
    }
    if (seenIds.has(recipe.id)) {
      issues.push({ type: 'error', recipeId: id, message: `Duplicate id: "${recipe.id}"` });
    }
    seenIds.add(recipe.id);

    // --- Name checks ---
    if (!recipe.name) {
      issues.push({ type: 'error', recipeId: id, message: 'Missing name' });
    } else if (seenNames.has(normalizeIngredient(recipe.name))) {
      issues.push({ type: 'warning', recipeId: id, message: `Duplicate name: "${recipe.name}"` });
    }
    seenNames.add(normalizeIngredient(recipe.name));

    // --- Description / emoji / steps ---
    if (!recipe.description) {
      issues.push({ type: 'error', recipeId: id, message: 'Missing description' });
    }
    if (!recipe.emoji) {
      issues.push({ type: 'warning', recipeId: id, message: 'Missing emoji' });
    }
    if (!recipe.steps || recipe.steps.length === 0) {
      issues.push({ type: 'error', recipeId: id, message: 'Empty steps array' });
    }

    // --- Category / difficulty / meal ---
    if (!recipe.category) {
      issues.push({ type: 'error', recipeId: id, message: 'Missing category' });
    }
    if (!VALID_DIFFICULTIES.has(recipe.difficulty)) {
      issues.push({ type: 'error', recipeId: id, message: `Invalid difficulty: "${recipe.difficulty}"` });
    }
    if (!VALID_MEALS.has(recipe.meal)) {
      issues.push({ type: 'warning', recipeId: id, message: `Unusual meal value: "${recipe.meal}"` });
    }

    // --- Must array checks ---
    if (!recipe.must || recipe.must.length === 0) {
      issues.push({ type: 'error', recipeId: id, message: 'Empty must array' });
    }

    const mustNorm = new Set<string>();
    for (const m of recipe.must ?? []) {
      const n = normalizeIngredient(m);
      if (!m || !m.trim()) {
        issues.push({ type: 'error', recipeId: id, message: 'Empty string in must array' });
        continue;
      }
      if (!isKnownIngredient(m)) {
        issues.push({ type: 'error', recipeId: id, message: `Must ingredient "${m}" not in master ingredient list` });
      }
      if (mustNorm.has(n)) {
        issues.push({ type: 'error', recipeId: id, message: `Duplicate must ingredient: "${m}"` });
      }
      mustNorm.add(n);
    }

    // --- Ingredients array checks ---
    const ingNorm = new Set<string>();
    for (const ing of recipe.ingredients ?? []) {
      const n = normalizeIngredient(ing);
      if (!ing || !ing.trim()) {
        issues.push({ type: 'error', recipeId: id, message: 'Empty string in ingredients array' });
        continue;
      }
      if (!isKnownIngredient(ing)) {
        issues.push({ type: 'error', recipeId: id, message: `Ingredient "${ing}" not in master ingredient list` });
      }
      if (ingNorm.has(n)) {
        issues.push({ type: 'warning', recipeId: id, message: `Duplicate ingredient: "${ing}"` });
      }
      ingNorm.add(n);
    }

    // --- Must ⊆ ingredients ---
    for (const m of recipe.must ?? []) {
      if (!normalizeIngredient(m)) continue;
      if (!(recipe.ingredients ?? []).some((i) => normalizeIngredient(i) === normalizeIngredient(m))) {
        issues.push({ type: 'error', recipeId: id, message: `Must ingredient "${m}" missing from ingredients array` });
      }
    }
  }

  return issues;
}

/**
 * Regression test: verifies that selecting every must ingredient for a
 * set of known-troublesome recipes makes them appear in results.
 */
export interface RegressionResult {
  recipeName: string;
  passed: boolean;
  matchPercent: number;
  reason?: string;
}

export function runRecipeRegression(): RegressionResult[] {
  const testNames = [
    'Chocolate Banana Bread',
    'Peanut Burfi',
    'Korean Spicy Cucumber Salad',
    'Parotta',
    'Peanut Chutney',
  ];

  return testNames.map((name) => {
    const recipe = RECIPES.find((r) => normalizeIngredient(r.name) === normalizeIngredient(name));
    if (!recipe) {
      return { recipeName: name, passed: false, matchPercent: 0, reason: 'Recipe not found in RECIPES array' };
    }
    // Simulate selecting the non-pantry must ingredients (pantry is auto-available)
    const nonPantryMust = recipe.must.filter((m) => !isIngredientAvailable(m, []));
    const selected = nonPantryMust.length > 0 ? nonPantryMust : recipe.must;
    const mustOk = recipe.must.every((m) => isIngredientAvailable(m, selected));
    if (!mustOk) {
      const missing = recipe.must.filter((m) => !isIngredientAvailable(m, selected));
      return { recipeName: name, passed: false, matchPercent: 0, reason: `Must ingredients not satisfied with selection [${selected.join(', ')}]: missing [${missing.join(', ')}]` };
    }
    let matched = 0;
    for (const ing of recipe.ingredients) {
      if (isIngredientAvailable(ing, selected)) matched++;
    }
    const pct = Math.round((matched / recipe.ingredients.length) * 100);
    return { recipeName: name, passed: true, matchPercent: pct };
  });
}

/**
 * Development-only: validates all recipes and logs a complete report.
 * Called once at app startup.
 */
export function logValidationIssues(): void {
  if (!import.meta.env.DEV) return;

  const issues = validateRecipes();
  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  console.group('%c[Cooking Thozhan] Recipe Engine Validation', 'color:#2563eb;font-weight:bold');

  if (errors.length > 0) {
    console.error(`%c${errors.length} error(s):`, 'color:#dc2626;font-weight:bold');
    for (const e of errors) {
      console.error(`  [${e.recipeId ?? 'global'}] ${e.message}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`%c${warnings.length} warning(s):`, 'color:#d97706;font-weight:bold');
    for (const w of warnings) {
      console.warn(`  [${w.recipeId ?? 'global'}] ${w.message}`);
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.info(`%cAll ${RECIPES.length} recipes valid. ${INGREDIENTS.length} ingredients registered.`, 'color:#16a34a;font-weight:bold');
  }

  // Regression test
  const regression = runRecipeRegression();
  const failed = regression.filter((r) => !r.passed);
  console.group('%cRegression Test', 'color:#2563eb;font-weight:bold');
  if (failed.length === 0) {
    console.info(`%cAll ${regression.length} regression recipes pass.`, 'color:#16a34a;font-weight:bold');
  } else {
    console.error(`%c${failed.length} regression failure(s):`, 'color:#dc2626;font-weight:bold');
  }
  for (const r of regression) {
    const status = r.passed ? 'PASS' : 'FAIL';
    const color = r.passed ? 'color:#16a34a' : 'color:#dc2626';
    console.log(`%c  ${status}%c ${r.recipeName} — ${r.matchPercent}%${r.reason ? ` (${r.reason})` : ''}`, color, 'color:inherit');
  }
  console.groupEnd();

  console.info(`Pantry staples: ${[...PANTRY_STAPLES].join(', ')}`);
  console.groupEnd();
}

export { RECIPES, INGREDIENTS };

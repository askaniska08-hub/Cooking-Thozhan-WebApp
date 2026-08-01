import { RECIPES } from '@/data/recipes';
import { INGREDIENTS } from '@/data/ingredients';
import { isKnownIngredient, normalizeIngredient } from '@/utils';

export interface ValidationIssue {
  type: 'error' | 'warning';
  recipeId?: string;
  message: string;
}

export function validateRecipes(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const validCategories = new Set(RECIPES.map((r) => r.category));

  for (const recipe of RECIPES) {
    const id = recipe.id ?? '(missing)';

    if (!recipe.id) {
      issues.push({ type: 'error', message: 'Recipe missing id' });
      continue;
    }

    if (seenIds.has(recipe.id)) {
      issues.push({ type: 'error', recipeId: id, message: `Duplicate id: "${recipe.id}"` });
    }
    seenIds.add(recipe.id);

    if (!recipe.name) {
      issues.push({ type: 'error', recipeId: id, message: 'Missing name' });
    } else if (seenNames.has(normalizeIngredient(recipe.name))) {
      issues.push({ type: 'warning', recipeId: id, message: `Duplicate name: "${recipe.name}"` });
    }
    seenNames.add(normalizeIngredient(recipe.name));

    if (!recipe.must || recipe.must.length === 0) {
      issues.push({ type: 'error', recipeId: id, message: 'Empty must array' });
    }

    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      issues.push({ type: 'error', recipeId: id, message: 'Empty ingredients array' });
    }

    if (!recipe.steps || recipe.steps.length === 0) {
      issues.push({ type: 'error', recipeId: id, message: 'Empty steps array' });
    }

    const mustNorm = new Set((recipe.must ?? []).map(normalizeIngredient));
    for (const m of recipe.must ?? []) {
      if (!isKnownIngredient(m)) {
        issues.push({ type: 'error', recipeId: id, message: `Must ingredient "${m}" not in master ingredient list` });
      }
      if (!(recipe.ingredients ?? []).some((i) => normalizeIngredient(i) === normalizeIngredient(m))) {
        issues.push({ type: 'error', recipeId: id, message: `Must ingredient "${m}" missing from ingredients array` });
      }
    }

    for (const ing of recipe.ingredients ?? []) {
      if (!isKnownIngredient(ing)) {
        issues.push({ type: 'error', recipeId: id, message: `Ingredient "${ing}" not in master ingredient list` });
      }
    }

    if (!validCategories.has(recipe.category)) {
      issues.push({ type: 'warning', recipeId: id, message: `Category "${recipe.category}" not used by any other recipe` });
    }
  }

  return issues;
}

export function logValidationIssues() {
  if (!import.meta.env.DEV) return;
  const issues = validateRecipes();
  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');
  if (errors.length > 0) {
    console.error(`[Recipe Validator] ${errors.length} error(s) found:`);
    for (const e of errors) {
      console.error(`  - [${e.recipeId ?? 'global'}] ${e.message}`);
    }
  }
  if (warnings.length > 0) {
    console.warn(`[Recipe Validator] ${warnings.length} warning(s):`);
    for (const w of warnings) {
      console.warn(`  - [${w.recipeId ?? 'global'}] ${w.message}`);
    }
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.info(`[Recipe Validator] All ${RECIPES.length} recipes valid. ${INGREDIENTS.length} ingredients registered.`);
  }
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Copy, Download, ChefHat, Check, Bot } from "lucide-react";
import { useAIGenerate } from "@/hooks/useAI";
import { useCreateRecipe } from "@/hooks/useRecipes";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AiGeneratePage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const promptParam = params.get("prompt");
      if (promptParam) {
        setDescription(promptParam);
      }
    }
  }, []);

  // Mutations
  const {
    mutate: generateRecipe,
    data: generatedRecipe,
    isPending: isGenerating,
    isError,
    reset,
  } = useAIGenerate();
  const { mutate: saveRecipe, isPending: isSaving } = useCreateRecipe();

  const handleGenerate = () => {
    if (description.trim()) {
      generateRecipe(description);
    }
  };

  const handleCopyText = () => {
    if (!generatedRecipe) return;

    const textToCopy = `
Recipe: ${generatedRecipe?.title || ""}
Cuisine: ${generatedRecipe?.cuisine || ""} | Difficulty: ${generatedRecipe?.difficulty ? generatedRecipe.difficulty.charAt(0).toUpperCase() + generatedRecipe.difficulty.slice(1).toLowerCase() : ""}
Cook Time: ${generatedRecipe?.cookTimeMinutes || 0} mins | Servings: ${generatedRecipe?.servings || 0}

Description:
${generatedRecipe?.description || ""}

Ingredients:
${generatedRecipe?.ingredients ? generatedRecipe.ingredients.map((ing) => `- ${ing.amount} ${ing.name}`).join("\n") : ""}

Instructions:
${generatedRecipe?.steps ? generatedRecipe.steps.map((step, idx) => `${idx + 1}. ${step}`).join("\n") : ""}

Tags:
${generatedRecipe?.tags ? generatedRecipe.tags.join(", ") : ""}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast.success("Recipe text copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToAccount = () => {
    if (!generatedRecipe) return;

    saveRecipe(generatedRecipe, {
      onSuccess: () => {
        router.push("/recipes/my");
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="AI Recipe Generator"
        description="Describe what you want to cook (e.g. 'A gluten-free dessert with bananas' or 'A spicy Indian lentil soup') and BiteBot will write a complete recipe for you."
      />

      <div className="flex flex-col gap-6">
        {/* Top: Prompt Input */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-semibold text-sm">
            <Bot className="h-4.5 w-4.5" />
            <span>AI Recipe Chef Prompt</span>
          </div>

          <Textarea
            placeholder="e.g. A fast 20-minute garlic butter pasta with mushrooms and parsley, suited for dinner..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isGenerating}
          />

          <div className="flex justify-end gap-2">
            {generatedRecipe && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDescription("");
                  reset();
                }}
                disabled={isGenerating}
                className="text-zinc-500 hover:text-zinc-800"
              >
                Clear
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              isLoading={isGenerating}
              className="flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              Generate Recipe
            </Button>
          </div>
        </div>

        {/* Bottom: Generated Output Display */}
        <div className="w-full">
          {isGenerating ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <LoadingSkeleton className="h-5 w-5 rounded-full border-2 border-indigo-650 border-t-transparent animate-spin" />
                <span className="text-sm font-medium text-zinc-500">
                  Creating culinary masterpiece...
                </span>
              </div>
              <LoadingSkeleton className="h-10 w-3/4" />
              <LoadingSkeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <LoadingSkeleton className="h-12" />
                <LoadingSkeleton className="h-12" />
              </div>
              <LoadingSkeleton className="h-[200px]" />
            </div>
          ) : generatedRecipe ? (
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in duration-300">
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Output Actions Bar */}
              <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-950/50">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-500" /> Generated
                  Recipe
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1"
                    onClick={handleCopyText}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1"
                    onClick={handleSaveToAccount}
                    isLoading={isSaving}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Save to Account
                  </Button>
                </div>
              </div>

              {/* Recipe Body */}
              <div className="p-6">
                <div>
                  <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                    {generatedRecipe?.cuisine}
                  </span>
                  <h2 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {generatedRecipe?.title}
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-450 italic">
                  {generatedRecipe?.description}
                </p>

                {/* Recipe Quick Stats */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-lg border border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-1.5">
                    Difficulty:{" "}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      {generatedRecipe?.difficulty
                        ? generatedRecipe.difficulty.charAt(0).toUpperCase() +
                          generatedRecipe.difficulty.slice(1).toLowerCase()
                        : ""}
                    </span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1.5">
                    Cook Time:{" "}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      {generatedRecipe?.cookTimeMinutes} mins
                    </span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1.5">
                    Servings:{" "}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                      {generatedRecipe?.servings} servings
                    </span>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                    Ingredients
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {generatedRecipe?.ingredients?.map((ing, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-650 dark:text-zinc-350 flex gap-2"
                      >
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                          •
                        </span>
                        <span>
                          <span className="font-semibold">{ing.amount}</span>{" "}
                          {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-900">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">
                    Directions
                  </h4>
                  <ol className="space-y-3">
                    {generatedRecipe?.steps?.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm text-zinc-650 dark:text-zinc-350"
                      >
                        <span className="font-bold text-indigo-500 shrink-0">
                          {idx + 1}.
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tags */}
                {generatedRecipe?.tags && generatedRecipe.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4 dark:border-zinc-900">
                    {generatedRecipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : isError ? (
            <div className="h-full flex items-center justify-center p-8 border border-zinc-200 border-dashed rounded-2xl bg-zinc-50/20 dark:border-zinc-800">
              <p className="text-sm text-red-500">
                Failed to generate recipe. Please review your prompt and try
                again.
              </p>
            </div>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center p-8 border border-zinc-200 border-dashed rounded-2xl bg-zinc-50/20 dark:border-zinc-800 text-center">
              <ChefHat className="h-10 w-10 text-zinc-350 dark:text-zinc-650 mb-3" />
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Recipe Preview Workspace
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-550 max-w-xs mt-1">
                Generated recipe content will display here. You can copy it or
                save it directly to your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

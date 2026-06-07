"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createIssue } from "@/services/api";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import {
  getCategoryOptions,
  getPriorityOptions,
  isIssueCategory,
  isIssuePriority,
} from "@/lib/format";

const categories = getCategoryOptions();
const priorities = getPriorityOptions();

const inputClassName =
  "w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/10";

const labelClassName = "block text-xs font-medium text-zinc-500";

const fieldErrorClassName = "text-xs text-red-400/90";

type FormErrors = {
  title?: string;
  description?: string;
  category?: string;
};

function validateForm(
  title: string,
  description: string,
  category: string,
): FormErrors {
  const errors: FormErrors = {};

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (title.length > 255) {
    errors.title = "Title must be at most 255 characters.";
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (!category) {
    errors.category = "Category is required.";
  } else if (!isIssueCategory(category)) {
    errors.category = "Please select a valid category.";
  }

  return errors;
}

export default function CreateIssuePage() {
  const router = useRouter();
  const { activeUser } = useActiveUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  function clearFieldError(field: keyof FormErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string).trim();
    const description = (formData.get("description") as string).trim();
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as string;
    const createdBy = activeUser.id;

    const fieldErrors = validateForm(title, description, category);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (!isIssueCategory(category)) {
      setError("Please select a valid category.");
      return;
    }

    if (!isIssuePriority(priority)) {
      setError("Please select a valid priority.");
      return;
    }

    setSubmitting(true);

    try {
      await createIssue({
        title,
        description,
        category,
        priority,
        createdBy,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-[680px]">
      <header className="mb-8 space-y-4 sm:mb-10">
        <Link
          href="/dashboard"
          className="inline-block text-sm text-zinc-500 transition-colors hover:text-white"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-xl font-medium tracking-tight text-white">
            Raise Issue
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Report a problem and track it through to resolution.
          </p>
        </div>
      </header>

      <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className={labelClassName}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Brief summary of the issue"
              className={inputClassName}
              onChange={() => clearFieldError("title")}
            />
            {errors.title && (
              <p className={fieldErrorClassName}>{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className={labelClassName}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Describe the issue in detail..."
              className={`${inputClassName} resize-none`}
              onChange={() => clearFieldError("description")}
            />
            {errors.description && (
              <p className={fieldErrorClassName}>{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className={labelClassName}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue=""
              className={`${inputClassName} text-zinc-400`}
              onChange={() => clearFieldError("category")}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map(({ value, label }) => (
                <option key={value} value={value} className="bg-[#090909]">
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={fieldErrorClassName}>{errors.category}</p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className={labelClassName}>Priority</legend>
            <div className="flex flex-col gap-0.5 rounded-md border border-white/[0.08] p-0.5 sm:flex-row">
              {priorities.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex flex-1 cursor-pointer items-center justify-center rounded px-2 py-2.5 text-xs text-zinc-500 transition-colors has-checked:bg-white/[0.08] has-checked:text-white hover:text-zinc-300 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    defaultChecked={value === "medium"}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <p className="text-sm text-red-400/90">{error}</p>
        )}

        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {submitting ? "Submitting..." : "Raise Issue"}
          </button>
          <Link
            href="/dashboard"
            className="w-full rounded-md border border-white/[0.08] px-4 py-2.5 text-center text-sm font-medium text-zinc-400 transition-colors hover:border-white/[0.15] hover:text-white sm:w-auto sm:py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

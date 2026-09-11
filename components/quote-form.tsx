"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icon";
import type { FormCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import {
  createQuoteRequestSchema,
  getMontrealToday,
  parcelTypes,
} from "@/lib/validation";

interface QuoteFormProps {
  locale: Locale;
  copy: FormCopy;
}

type FieldErrors = Record<string, string>;

type ApiResponse = {
  ok: boolean;
  code?: string;
  reference?: string | null;
  fields?: string[];
};

function errorForField(field: string, copy: FormCopy) {
  if (field === "email") return copy.errors.email;
  if (field === "phone") return copy.errors.phone;
  if (field === "deliveryDate") return copy.errors.date;
  return copy.errors.required;
}

export function QuoteForm({ locale, copy }: QuoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "error"; message: string }
    | { kind: "success"; reference?: string }
  >({ kind: "idle" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function focusFirstInvalid(fields: string[]) {
    const firstField = fields[0];
    if (!firstField) return;
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const values = {
      ...Object.fromEntries(new FormData(form).entries()),
      startedAt: startedAt.current,
    };
    const parsed = createQuoteRequestSchema(getMontrealToday()).safeParse(values);

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !errors[field]) {
          errors[field] = errorForField(field, copy);
        }
      }
      const fields = Object.keys(errors);
      setFieldErrors(errors);
      setStatus({ kind: "error", message: copy.errors.invalid });
      focusFirstInvalid(fields);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ApiResponse;

      if (response.ok && result.ok) {
        form.reset();
        startedAt.current = Date.now();
        setStatus({
          kind: "success",
          reference: result.reference ?? undefined,
        });
        return;
      }

      if (result.code === "validation_failed" && result.fields?.length) {
        const errors = Object.fromEntries(
          result.fields.map((field) => [field, errorForField(field, copy)]),
        );
        setFieldErrors(errors);
        setStatus({ kind: "error", message: copy.errors.invalid });
        focusFirstInvalid(result.fields);
      } else if (result.code === "rate_limited") {
        setStatus({ kind: "error", message: copy.errors.rateLimited });
      } else if (result.code === "service_unavailable") {
        setStatus({ kind: "error", message: copy.errors.unavailable });
      } else {
        setStatus({ kind: "error", message: copy.errors.generic });
      }
    } catch {
      setStatus({ kind: "error", message: copy.errors.generic });
    } finally {
      setSubmitting(false);
    }
  }

  const describedBy = (field: string) =>
    fieldErrors[field] ? `${field}-error` : undefined;

  return (
    <form ref={formRef} className="quote-form" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="language" value={locale} />
      <div className="spam-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-heading">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
        </div>
        <p>{copy.intro}</p>
      </div>
      <p className="required-note">{copy.requiredNote}</p>

      <div className="form-grid">
        <FormField
          id="customerName"
          label={copy.labels.customerName}
          error={fieldErrors.customerName}
        >
          <input
            id="customerName"
            name="customerName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            placeholder={copy.placeholders.customerName}
            required
            aria-invalid={Boolean(fieldErrors.customerName)}
            aria-describedby={describedBy("customerName")}
          />
        </FormField>

        <FormField
          id="company"
          label={copy.labels.company}
          optional={copy.labels.optional}
          error={fieldErrors.company}
        >
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={120}
            placeholder={copy.placeholders.company}
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={describedBy("company")}
          />
        </FormField>

        <FormField
          id="phone"
          label={copy.labels.phone}
          error={fieldErrors.phone}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            minLength={7}
            maxLength={32}
            placeholder={copy.placeholders.phone}
            required
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={describedBy("phone")}
          />
        </FormField>

        <FormField
          id="email"
          label={copy.labels.email}
          error={fieldErrors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            placeholder={copy.placeholders.email}
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describedBy("email")}
          />
        </FormField>

        <FormField
          id="pickupAddress"
          label={copy.labels.pickupAddress}
          error={fieldErrors.pickupAddress}
          wide
        >
          <span className="input-with-icon">
            <Icon name="mapPin" size={19} />
            <input
              id="pickupAddress"
              name="pickupAddress"
              type="text"
              autoComplete="street-address"
              minLength={5}
              maxLength={240}
              placeholder={copy.placeholders.pickupAddress}
              required
              aria-invalid={Boolean(fieldErrors.pickupAddress)}
              aria-describedby={describedBy("pickupAddress")}
            />
          </span>
        </FormField>

        <FormField
          id="deliveryAddress"
          label={copy.labels.deliveryAddress}
          error={fieldErrors.deliveryAddress}
          wide
        >
          <span className="input-with-icon">
            <Icon name="mapPin" size={19} />
            <input
              id="deliveryAddress"
              name="deliveryAddress"
              type="text"
              autoComplete="off"
              minLength={5}
              maxLength={240}
              placeholder={copy.placeholders.deliveryAddress}
              required
              aria-invalid={Boolean(fieldErrors.deliveryAddress)}
              aria-describedby={describedBy("deliveryAddress")}
            />
          </span>
        </FormField>

        <FormField
          id="deliveryDate"
          label={copy.labels.deliveryDate}
          error={fieldErrors.deliveryDate}
        >
          <input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            required
            aria-invalid={Boolean(fieldErrors.deliveryDate)}
            aria-describedby={describedBy("deliveryDate")}
          />
        </FormField>

        <FormField
          id="parcelType"
          label={copy.labels.parcelType}
          error={fieldErrors.parcelType}
        >
          <select
            id="parcelType"
            name="parcelType"
            defaultValue=""
            required
            aria-invalid={Boolean(fieldErrors.parcelType)}
            aria-describedby={describedBy("parcelType")}
          >
            <option value="" disabled>
              {copy.placeholders.parcelType}
            </option>
            {parcelTypes.map((type) => (
              <option key={type} value={type}>
                {copy.parcelTypes[type]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="instructions"
          label={copy.labels.instructions}
          optional={copy.labels.optional}
          error={fieldErrors.instructions}
          wide
        >
          <textarea
            id="instructions"
            name="instructions"
            rows={4}
            maxLength={1000}
            placeholder={copy.placeholders.instructions}
            aria-invalid={Boolean(fieldErrors.instructions)}
            aria-describedby={describedBy("instructions")}
          />
        </FormField>
      </div>

      <div className="form-footer">
        <p>
          <Icon name="check" size={17} />
          {copy.privacy}
        </p>
        <button className="button button--dark" type="submit" disabled={submitting}>
          {submitting ? copy.submitting : copy.submit}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status.kind === "error" && (
          <p className="form-status__error" role="alert">
            {status.message}
          </p>
        )}
        {status.kind === "success" && (
          <p className="form-status__success">
            <Icon name="check" size={20} />
            <span>
              {copy.success}
              {status.reference && (
                <strong>
                  {copy.successReference} : {status.reference}
                </strong>
              )}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}

function FormField({
  id,
  label,
  optional,
  error,
  wide,
  children,
}: FormFieldProps) {
  return (
    <div className={`field ${wide ? "field--wide" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional ? (
          <small>({optional})</small>
        ) : (
          <span aria-hidden="true"> *</span>
        )}
      </label>
      {children}
      {error && (
        <span className="field__error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

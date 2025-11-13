/**
 * Security utilities for GDPR compliance and data protection
 */

import crypto from "crypto";

/**
 * Pseudonymize user ID for OpenAI API compliance
 * Uses SHA-256 hash (one-way, cannot be reversed)
 */
export function pseudonymizeUserId(userId: string): string {
  return crypto.createHash("sha256").update(userId).digest("hex").substring(0, 16);
}

/**
 * Sanitize user input to remove PII (Personally Identifiable Information)
 */
export function sanitizeUserInput(input: string): string {
  let sanitized = input;

  // Remove email addresses
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    "[EMAIL]"
  );

  // Remove phone numbers (Finnish and international formats)
  sanitized = sanitized.replace(
    /\b(?:\+358|0)[\s-]?\d{2,3}[\s-]?\d{3,4}[\s-]?\d{2,4}\b/g,
    "[PHONE]"
  );
  sanitized = sanitized.replace(/\b\d{10,}\b/g, "[PHONE]");

  // Remove potential addresses
  sanitized = sanitized.replace(
    /\b\d+\s+[A-Za-z\s]+(?:Street|Avenue|Road|Katu|Tie|Kuja|Keskusta|Kylä)\b/gi,
    "[ADDRESS]"
  );

  // Remove potential social security numbers (Finnish format)
  sanitized = sanitized.replace(/\b\d{6}[-+A]\d{3}[A-Z0-9]\b/gi, "[SSN]");

  // Remove potential credit card numbers
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CARD]");

  return sanitized.trim();
}

/**
 * Validate that input doesn't contain excessive PII
 */
export function validateInputSafety(input: string): { safe: boolean; reason?: string } {
  const emailCount = (input.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi) || []).length;
  const phoneCount = (input.match(/\b(?:\+358|0)[\s-]?\d{2,3}[\s-]?\d{3,4}[\s-]?\d{2,4}\b/g) || []).length;

  if (emailCount > 2) {
    return { safe: false, reason: "Too many email addresses detected" };
  }
  if (phoneCount > 2) {
    return { safe: false, reason: "Too many phone numbers detected" };
  }

  return { safe: true };
}


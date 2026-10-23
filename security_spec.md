# Security Specification: Coffee Grinder Dial Log (Clik)

## 1. Data Invariants
1. Grinder settings document `/settings/{settingId}` must contain numeric clicks for `mischiefClicks` and `lenodiClicks`, both non-negative and bounded (M40 <= 100, LEnodi <= 100).
2. Brew logs document `/brew_logs/{logId}` must have valid grinderId ('mischief-m40' | 'lenodi'), non-empty beanName, valid extractionVerdict, and valid bounded numeric clicks.
3. Path variables must be valid alphanumeric IDs without script injection.

## 2. Dirty Dozen Test Cases
1. Setting negative clicks (-10).
2. Setting excessive clicks (10000).
3. Injecting non-allowed properties or arbitrary schema pollution.
4. Setting invalid grinderId (e.g. 'fake-grinder').
5. Missing required beanName on create.
6. Excessive string lengths exceeding maximum character limit (> 500 characters).
7. Invalid extractionVerdict (e.g. 'broken').
8. Document ID path traversal or invalid ID characters.
9. Array size exhaustion on flavorNotes.
10. Unauthenticated tampering where restricted.
11. Malformed JSON types (e.g., passing string instead of number for doseGrams).
12. Attempting to bypass schema blueprint validation.

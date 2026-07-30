# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> Registration >> shows error for duplicate email
- Location: e2e\auth.spec.ts:21:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText(/already exists/i)
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/already exists/i)
  - Protocol error (Runtime.callFunctionOn): Internal server error, session closed.

```

```
Error: apiRequestContext._wrapApiCall: Target page, context or browser has been closed
```
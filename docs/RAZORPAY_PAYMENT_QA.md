# Razorpay payment QA

| ID | Scenario | Status |
|----|----------|--------|
| RZP-01 | `inrToPaise` unit test | PASS (automated) |
| RZP-02 | Webhook HMAC validation | PASS (automated) |
| RZP-03 | Create payment link (test mode) | NOT RUN — requires keys in local `.env` |
| RZP-04 | Webhook end-to-end | NOT RUN — requires public URL + test payment |
| RZP-05 | Partial payment → PARTIALLY_PAID | NOT RUN |
| RZP-06 | Duplicate webhook idempotency | NOT RUN (logic implemented) |

Use Razorpay **test** keys only in QA. Never use live keys in automated tests.

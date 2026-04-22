# Sliding-Window Ticket TTL for Active Pagination

## Status

- Proposed feature / change request
- Scope: Backend result caching and frontend error handling
- Goal: Prevent ticket expiration during active pagination and improve user experience when tickets expire

## Summary

Result tickets expire after 10 minutes (600s) from when results become ready, causing pagination failures when users browse results for extended periods. This proposal recommends implementing a sliding-window TTL that resets the expiration timer on each page request, supplemented by frontend error handling for expired tickets.

## Problem

Users experience silent pagination failures when result tickets expire:

1. User submits KWIC or word trends query
2. Ticket is created with 10-minute expiration (from ready time)
3. User views first page successfully
4. User browses results slowly or leaves page open
5. After 10 minutes, ticket expires and is deleted
6. User clicks "next page" → 404 error with no UI feedback
7. Page shows loading spinner forever or empty table

**Current behavior:**
- Fixed-window expiration: ticket expires 600s after `ready_at`, regardless of activity
- Pagination methods (`fetchKwicPage`, `fetchSpeechesPage`) have no error handling
- Generic error messages don't distinguish expiration from other failures
- No user guidance to resubmit query after expiration

**Impact:**
- Poor UX for users reviewing results methodically
- No clear feedback when tickets expire
- Users don't understand why pagination suddenly stops working
- Confusion about whether to refresh, resubmit, or report a bug

## Scope

**This proposal covers:**
- Backend: Sliding-window TTL implementation in ResultStore
- Backend: Maximum absolute lifetime cap to prevent unbounded tickets
- Frontend: Error handling for ticket expiration during pagination
- Frontend: User-friendly Swedish error messages
- Frontend: Optional auto-retry mechanism

**Non-Goals:**
- Changing ticket creation flow or status polling
- Implementing persistent ticket storage (DB-backed)
- Adding ticket lifecycle UI indicators (time remaining)
- Extending TTL beyond reasonable limits

## Current Behavior

**Backend (api_swedeb/api/services/result_store.py):**
```python
def create_ticket(self) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds)
    # Ticket created with fixed expiration

def store_ready(self, ticket_id: str, artifact: Any) -> None:
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds)
    # Expiration reset when results ready, but NOT on subsequent page requests

def get_page_result(self, ticket_id: str, page: int, page_size: int, ...) -> dict:
    ticket = self.require_ticket(ticket_id)  # Raises 404 if expired/missing
    # NO expiration reset here
```

**Frontend (src/stores/kwicDataStore.js, wordTrendsDataStore.js):**
```javascript
async fetchKwicPage({ page, rowsPerPage, sortBy, descending }) {
  // NO try/catch block - errors crash silently
  const response = await api.get(`/tools/kwic/results/${this.ticketId}`, {...});
  // Process response
}
```

## Proposed Design

### Backend: Sliding-Window TTL

**Add ticket touch method:**
```python
def touch_ticket(self, ticket_id: str) -> None:
    """Reset ticket expiration on access during pagination."""
    ticket = self.require_ticket(ticket_id)
    new_expiration = datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds)
    
    # Cap absolute lifetime to prevent unbounded tickets
    max_lifetime = ticket.created_at + timedelta(seconds=self.max_absolute_lifetime)
    ticket.expires_at = min(new_expiration, max_lifetime)
```

**Call from page endpoints:**
```python
def get_page_result(self, ticket_id: str, page: int, page_size: int, ...) -> dict:
    self.touch_ticket(ticket_id)  # Reset TTL on active use
    ticket = self.require_ticket(ticket_id)
    # ... existing pagination logic
```

**Configuration:**
```yaml
result_store:
  result_ttl_seconds: 600        # Sliding window: 10 minutes
  max_absolute_lifetime: 3600    # Hard cap: 1 hour from creation
```

### Frontend: Error Handling

**Add try/catch to pagination methods:**
```javascript
async fetchKwicPage({ page, rowsPerPage, sortBy, descending }) {
  try {
    const response = await api.get(`/tools/kwic/results/${this.ticketId}`, {...});
    // ... existing response handling
  } catch (error) {
    if (error.response?.status === 404) {
      this.errorMessage = "Sökresultaten har gått ut. Vänligen gör en ny sökning.";
      this.resetTicketState();
    } else {
      this.errorMessage = this.getErrorMessage(error);
    }
    console.error("Error fetching KWIC page:", error);
  } finally {
    if (pageRequestId === this.pageRequestSequence) {
      this.isPageLoading = false;
    }
  }
}
```

**User-facing error messages (Swedish):**
- KWIC: "Sökresultaten har gått ut. Vänligen gör en ny sökning."
- Word Trends: "Resultaten har gått ut. Vänligen gör en ny sökning."

## Alternatives Considered

**1. Auto-retry on expiration**
- Silently resubmit query when ticket expires
- **Rejected**: May confuse users if results change; expensive for large queries

**2. Extend fixed TTL to 1 hour**
- Simple config change, no code changes
- **Rejected**: Wastes memory on abandoned searches; doesn't solve the root problem

**3. Show expiration countdown in UI**
- Display "Results expire in 8:32" timer
- **Rejected**: Adds complexity; users don't need to track time if sliding window works

**4. No TTL reset, frontend-only error handling**
- Only implement the error handling, keep fixed TTL
- **Rejected**: Poor UX for legitimate use cases (slow browsing, reviewing results carefully)

## Risks And Tradeoffs

**Sliding-window TTL:**
- **Risk**: Memory accumulation if many users keep tickets alive
  - **Mitigation**: Maximum absolute lifetime cap (1 hour)
- **Risk**: Tickets may live longer than expected
  - **Mitigation**: Cleanup still runs every 60s; absolute cap enforces max lifetime
- **Tradeoff**: Slightly more complex ticket lifecycle logic
  - **Benefit**: Much better UX for active users

**Frontend error handling:**
- **Risk**: Error messages may not always indicate expiration (could be network issues)
  - **Mitigation**: Use `response.status === 404` specifically
- **Tradeoff**: Additional code in two store files
  - **Benefit**: Critical UX improvement; prevents silent failures

## Testing And Validation

**Backend unit tests:**
- Test `touch_ticket()` resets expiration correctly
- Test absolute lifetime cap is enforced
- Test expired tickets still raise 404
- Test cleanup still removes expired tickets

**Backend integration tests:**
- Test page requests reset TTL
- Test download requests reset TTL
- Test ticket expires after absolute lifetime even with activity

**Frontend manual testing:**
- Submit query, wait 8 minutes, paginate → should work
- Submit query, wait 12 minutes (with no activity) → should show error message
- Verify error message is in Swedish and actionable
- Test both KWIC and word trends pagination

**Performance validation:**
- Measure cleanup performance with sliding-window tickets
- Verify memory usage stays bounded

## Acceptance Criteria

**Must have:**
- ✅ Backend `touch_ticket()` method resets TTL on page/download requests
- ✅ Backend enforces absolute lifetime cap (default 1 hour)
- ✅ Frontend pagination methods have try/catch error handling
- ✅ Frontend shows Swedish error message for expired tickets
- ✅ Frontend resets ticket state on expiration error
- ✅ All tests pass (backend unit + integration, frontend manual)

**Nice to have:**
- ✅ Configuration documentation updated in OPERATIONS.md
- ✅ Error messages include actionable guidance ("gör en ny sökning")

## Recommended Delivery Order

**Phase 1: Frontend error handling (immediate fix)**
1. Add try/catch to `fetchKwicPage()` in kwicDataStore.js
2. Add try/catch to `fetchSpeechesPage()` in wordTrendsDataStore.js
3. Add Swedish error messages for ticket expiration
4. Manual test both tools
5. Commit to frontend repo

**Phase 2: Backend sliding-window TTL (long-term solution)**
1. Add `max_absolute_lifetime` config setting
2. Implement `touch_ticket()` method in ResultStore
3. Call `touch_ticket()` from page/download endpoints
4. Add unit tests for TTL reset and absolute cap
5. Add integration tests for pagination TTL behavior
6. Update OPERATIONS.md with new behavior
7. Commit to backend repo

**Phase 3: Deploy and validate**
1. Deploy frontend changes to test environment
2. Deploy backend changes to test environment
3. Perform manual end-to-end testing
4. Monitor memory usage and cleanup performance
5. Deploy to staging, then production

## Final Recommendation

**Implement both frontend and backend changes in two phases:**

1. **Short-term** (this PR): Add frontend error handling to prevent silent failures and provide user feedback
2. **Long-term** (follow-up issue): Implement sliding-window TTL backend to prevent expiration during active use

This approach provides immediate UX improvement while leaving room for the more robust backend solution. The frontend error handling is valuable even with sliding-window TTL, as it gracefully handles edge cases like network errors or unexpected server states.

**Estimated effort:**
- Frontend changes: ~1 hour (2 stores + testing)
- Backend changes: ~3 hours (implementation + tests + docs)
- Total: ~4 hours

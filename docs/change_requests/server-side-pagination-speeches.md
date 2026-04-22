# Server-Side Pagination for Speeches Tool

## Status

- Proposed feature
- Scope: Backend API and frontend UX for /tools/speeches
- Goal: Add ticket-based async pagination to Speeches tool, consistent with KWIC and word trends

## Summary

The Speeches tool currently loads all matching speeches in a single API request, which can cause performance issues with large result sets. This proposal recommends implementing ticket-based server-side pagination matching the pattern already used for KWIC and word trends speeches.

## Problem

**Current behavior:**
- Single GET `/tools/speeches` returns all speeches matching filters
- No pagination support - all results loaded at once
- Can be slow for large result sets (e.g., filtering by party across many years)
- Frontend displays all rows in memory via client-side pagination
- Inconsistent UX compared to KWIC and word trends tools

**Impact:**
- Poor performance for large result sets
- High memory usage on both backend and frontend
- Long initial load times for broad filters
- Inconsistent user experience across tools
- No graceful handling of very large result sets

## Scope

**This proposal covers:**
- Backend: New ticket-based endpoints for speeches
  - POST `/tools/speeches/query` - Submit query, return ticket
  - GET `/tools/speeches/status/{ticket_id}` - Check ticket status
  - GET `/tools/speeches/page/{ticket_id}` - Fetch paginated results
- Frontend: New `speechesTable.vue` component with server-side pagination
- Frontend: Update `speechesDataStore.js` for ticket workflow
- Frontend: Wire up new component in `SpeechesPage.vue`
- Reuse existing `ResultStore` and ticket lifecycle infrastructure

**Non-Goals:**
- Changing existing `/tools/speeches` GET endpoint (preserve for backward compatibility)
- Changing `/tools/speeches/download` endpoint (already supports tickets)
- Adding new filter capabilities
- Changing the speeches index structure

## Current Behavior

**Backend:**
- `/tools/speeches` (GET/POST) - Returns all speeches in `SpeechesResult` model
- `search_service.get_speeches(selections)` - Returns full DataFrame
- No ticket workflow, no pagination

**Frontend:**
- `SpeechesPage.vue` - Loads all speeches via `speechStore.getSpeechesResult()`
- `speechesDataStore.js` - Simple GET request, stores all results in memory
- `speechDataTable.vue` - Generic table component, client-side pagination
- Used by Speeches tool only (unlike KWIC/word trends which share components)

## Proposed Design

### Backend Changes

#### New Endpoints

**1. POST `/tools/speeches/query`**
```python
@router.post("/tools/speeches/query", response_model=TicketResponse)
async def submit_speeches_query(
    commons: CommonParams,
    search_service: SearchService = Depends(get_search_service),
    result_store: ResultStore = Depends(get_result_store),
) -> TicketResponse:
    """Submit async query for speeches matching filters"""
    ticket_id = result_store.create_ticket()
    
    # Spawn background task to execute query
    async def compute_speeches():
        try:
            df = search_service.get_speeches(selections=commons.get_filter_opts(True))
            result_store.store_ready(ticket_id, df)
        except Exception as e:
            result_store.mark_error(ticket_id, str(e))
    
    asyncio.create_task(compute_speeches())
    return result_store.get_ticket_response(ticket_id)
```

**2. GET `/tools/speeches/status/{ticket_id}`**
```python
@router.get("/tools/speeches/status/{ticket_id}", response_model=TicketStatusResponse)
async def get_speeches_status(
    ticket_id: str,
    result_store: ResultStore = Depends(get_result_store),
) -> TicketStatusResponse:
    """Check status of async speeches query"""
    return result_store.get_status_response(ticket_id)
```

**3. GET `/tools/speeches/page/{ticket_id}`**
```python
@router.get("/tools/speeches/page/{ticket_id}", response_model=SpeechesPageResult)
async def get_speeches_page(
    ticket_id: str,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    sort_by: str = Query(default="year"),
    sort_order: str = Query(default="asc"),
    result_store: ResultStore = Depends(get_result_store),
) -> SpeechesPageResult:
    """Fetch paginated speeches from completed query"""
    df = result_store.get_page_result(ticket_id, page, page_size, sort_by, sort_order)
    
    # Use existing mapper
    page_data = speeches_to_api_model(df)
    
    return SpeechesPageResult(
        speech_list=page_data.speech_list,
        total_hits=result_store.get_ticket(ticket_id).total_hits,
        total_pages=result_store.get_ticket(ticket_id).total_pages,
        page=page,
        page_size=page_size,
        expires_at=result_store.get_ticket(ticket_id).expires_at,
    )
```

#### New Schema

**`SpeechesPageResult`** (extends existing `SpeechesResult`):
```python
class SpeechesPageResult(BaseModel):
    speech_list: list[SpeechesTextResultItem]
    total_hits: int
    total_pages: int
    page: int
    page_size: int
    expires_at: datetime
```

### Frontend Changes

#### 1. New Component: `speechesTable.vue`

Similar to `wordTrendsSpeechTable.vue`, with:
- Error banner for `speechesErrorMessage`
- `q-table` with server-side pagination via `@request="onRequest"`
- Download buttons (CSV, Excel)
- Expandable rows
- Party color coding

**Key differences from wordTrendsSpeechTable:**
- No "Sökord" (node_word) column
- Different download endpoints
- Uses `speechesDataStore` instead of `wordTrendsDataStore`

#### 2. Update `speechesDataStore.js`

Add ticket workflow actions matching `kwicDataStore.js` pattern:

```javascript
state: () => ({
  speechesData: [],
  ticketId: null,
  expiresAt: null,
  totalHits: 0,
  totalPages: 0,
  isLoading: false,
  isPageLoading: false,
  errorMessage: "",
  pagination: {
    page: 1,
    rowsPerPage: 10,
    sortBy: "year",
    descending: false,
    rowsNumber: 0,
  },
}),

actions: {
  async getSpeechesTicketResult() {
    // Submit query via POST /tools/speeches/query
    // Poll status via GET /tools/speeches/status/{ticket_id}
    // Fetch first page via GET /tools/speeches/page/{ticket_id}
  },
  
  async fetchSpeechesPage({ page, rowsPerPage, sortBy, descending }) {
    try {
      const response = await api.get(`/tools/speeches/page/${this.ticketId}`, {
        params: { page, page_size: rowsPerPage, sort_by, sort_order: descending ? "desc" : "asc" }
      });
      
      this.speechesData = response.data.speech_list;
      this.totalHits = response.data.total_hits;
      this.totalPages = response.data.total_pages;
      this.pagination = { page, rowsPerPage, sortBy, descending, rowsNumber: response.data.total_hits };
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        this.errorMessage = "Resultaten har gått ut. Vänligen gör en ny sökning.";
        this.resetTicketState();
      } else {
        this.errorMessage = error?.response?.data?.detail || error?.message || "Kunde inte hämta anföranden";
      }
      console.error("Error fetching speeches page:", error);
      return null;
    } finally {
      this.isPageLoading = false;
    }
  },
  
  resetTicketState() {
    this.ticketId = null;
    this.expiresAt = null;
    this.errorMessage = "";
  },
}
```

#### 3. Update `SpeechesPage.vue`

Replace `speechDataTable` with new `speechesTable` component:

```vue
<template>
  <loadingIcon v-if="loading" size="100" />
  <speechesTable v-else />
</template>

<script setup>
import speechesTable from "src/components/speechesTable.vue";
// Update watchEffect to call speechStore.getSpeechesTicketResult()
</script>
```

## Alternatives Considered

**1. Keep client-side pagination, add result limit**
- Simple: just cap results at 10,000 speeches
- **Rejected**: Band-aid solution; doesn't solve performance problem; inconsistent with other tools

**2. Add pagination to existing `/tools/speeches` endpoint**
- Simpler: no ticket workflow needed
- **Rejected**: Slow for large result sets (still needs to compute all matches before paginating)

**3. Create entirely new endpoint path (e.g., `/tools/speeches/v2`)**
- Clean separation from legacy endpoint
- **Rejected**: Unnecessary complexity; ticket workflow is proven pattern

**4. Modify existing endpoint to support both modes**
- Single endpoint with optional `?use_tickets=true` parameter
- **Rejected**: Mixing sync/async modes in one endpoint is confusing; prefer separate ticket endpoints

## Risks And Tradeoffs

**Risks:**
- **Breaking changes**: Minimal - old GET endpoint remains unchanged
- **Migration effort**: Moderate - need to update frontend store and component
- **Ticket cleanup**: Already handled by existing ResultStore infrastructure
- **Testing surface**: New endpoints need integration tests

**Tradeoffs:**
- **Complexity**: Adds 3 endpoints + ticket workflow logic
  - **Benefit**: Consistent pattern across all tools; reuses existing infrastructure
- **Initial load time**: Ticket polling adds ~100-500ms overhead
  - **Benefit**: Subsequent pagination is instant; handles large results gracefully
- **Backend memory**: Tickets store DataFrames in memory
  - **Benefit**: Already managed via TTL and cleanup; results are paginated

## Testing And Validation

**Backend unit tests:**
- Test `/tools/speeches/query` creates ticket and returns ticket_id
- Test `/tools/speeches/status/{ticket_id}` returns pending → ready states
- Test `/tools/speeches/page/{ticket_id}` returns correct page subset
- Test sorting and pagination parameters
- Test ticket expiration handling (404 after TTL)

**Backend integration tests:**
- Full ticket workflow: query → poll status → fetch pages
- Test with various filter combinations
- Test page boundaries (first, middle, last page)
- Test expired ticket returns 404

**Frontend manual testing:**
- Submit speeches query → verify loading state
- Verify first page loads automatically
- Click "next page" → verify page 2 loads
- Test sorting columns
- Test rows-per-page changes
- Wait 10 minutes → verify expiration error message
- Test error recovery (resubmit after expiration)

**Performance validation:**
- Measure ticket workflow overhead vs direct GET
- Test with large result sets (10k+ speeches)
- Verify memory usage stays bounded with pagination

## Acceptance Criteria

**Must have:**
- ✅ Backend POST `/tools/speeches/query` endpoint
- ✅ Backend GET `/tools/speeches/status/{ticket_id}` endpoint
- ✅ Backend GET `/tools/speeches/page/{ticket_id}` endpoint
- ✅ Frontend `speechesTable.vue` component with pagination
- ✅ Frontend `speechesDataStore.js` ticket workflow
- ✅ Frontend error handling for expired tickets (Swedish messages)
- ✅ `SpeechesPage.vue` uses new component
- ✅ Download buttons work (CSV, Excel)
- ✅ All tests pass (backend unit + integration, frontend manual)
- ✅ Existing GET `/tools/speeches` endpoint still works (backward compatibility)

**Nice to have:**
- ✅ Backend sliding-window TTL (if implemented per issue #166 proposal)
- ✅ Performance metrics comparing old vs new approach
- ✅ Migration guide for any external API consumers

## Implementation Checklist

### Backend (swedeb-api)

**Phase 1: Core endpoints**
- [ ] Add `SpeechesPageResult` schema to `api_swedeb/schemas/speeches.py`
- [ ] Add POST `/tools/speeches/query` endpoint in `tool_router.py`
- [ ] Add GET `/tools/speeches/status/{ticket_id}` endpoint
- [ ] Add GET `/tools/speeches/page/{ticket_id}` endpoint with pagination params
- [ ] Update mapper to support pagination metadata
- [ ] Add unit tests for new endpoints
- [ ] Add integration tests for ticket workflow

**Phase 2: Error handling**
- [ ] Add ticket expiration handling (404)
- [ ] Add proper error messages for invalid ticket states
- [ ] Test error paths (missing ticket, expired ticket, failed ticket)

**Phase 3: Documentation**
- [ ] Update OpenAPI/Swagger docs for new endpoints
- [ ] Add docstrings to new endpoints
- [ ] Document pagination parameters
- [ ] Update OPERATIONS.md if needed (cache configuration already documented)

### Frontend (swedeb_frontend)

**Phase 1: Store updates**
- [ ] Add ticket workflow state to `speechesDataStore.js`
  - [ ] `ticketId`, `expiresAt`, `totalHits`, `totalPages`
  - [ ] `isLoading`, `isPageLoading`, `errorMessage`
  - [ ] `pagination` object
- [ ] Add `getSpeechesTicketResult()` action
- [ ] Add `waitForTicketReady()` polling action
- [ ] Add `fetchSpeechesPage()` action with error handling
- [ ] Add `resetTicketState()` action
- [ ] Add Swedish error messages for ticket expiration

**Phase 2: Component creation**
- [ ] Create `src/components/speechesTable.vue`
- [ ] Add error banner for `errorMessage`
- [ ] Add `q-table` with server-side pagination
- [ ] Add `@request="onRequest"` handler calling `fetchSpeechesPage()`
- [ ] Add download buttons (CSV, Excel)
- [ ] Add expandable row functionality
- [ ] Add party color coding
- [ ] Remove "Sökord" column (not applicable to speeches tool)

**Phase 3: Page integration**
- [ ] Update `SpeechesPage.vue` to import `speechesTable`
- [ ] Replace `<speechDataTable type="speeches" />` with `<speechesTable />`
- [ ] Update `watchEffect` to call `getSpeechesTicketResult()`
- [ ] Test loading states work correctly
- [ ] Remove unused `speechDataTable` import if no longer needed

**Phase 4: Testing & polish**
- [ ] Manual test: Submit query → verify first page loads
- [ ] Manual test: Navigate pages → verify pagination works
- [ ] Manual test: Sort columns → verify sorting works
- [ ] Manual test: Change rows per page → verify page size changes
- [ ] Manual test: Wait for expiration → verify error message
- [ ] Manual test: Download CSV → verify download works
- [ ] Manual test: Download Excel → verify download works
- [ ] Test with various filter combinations
- [ ] Verify error messages are in Swedish

### Documentation

- [ ] Update change proposal with implementation notes
- [ ] Document any deviations from original design
- [ ] Add migration notes if old endpoint behavior changes

### Deployment

- [ ] Deploy backend changes to test environment
- [ ] Deploy frontend changes to test environment
- [ ] Perform end-to-end testing in test environment
- [ ] Deploy to staging
- [ ] Deploy to production
- [ ] Monitor performance and error rates

## Recommended Delivery Order

**Phase 1: Backend foundation** (~2-3 hours)
1. Add schema for `SpeechesPageResult`
2. Implement 3 new endpoints (query, status, page)
3. Add unit tests
4. Add integration tests

**Phase 2: Frontend store** (~1 hour)
1. Update `speechesDataStore.js` with ticket workflow
2. Add error handling for ticket expiration

**Phase 3: Frontend component** (~2 hours)
1. Create `speechesTable.vue` component
2. Wire up server-side pagination
3. Add download functionality

**Phase 4: Integration** (~30 minutes)
1. Update `SpeechesPage.vue`
2. Manual testing
3. Bug fixes

**Total estimated effort: ~6 hours**

## Final Recommendation

**Implement server-side pagination for Speeches tool using ticket-based workflow.**

This brings the Speeches tool in line with KWIC and word trends, providing consistent UX across all tools. The ticket-based pattern is proven, the infrastructure already exists (ResultStore), and the implementation is straightforward.

**Dependencies:**
- No blocking dependencies
- Can implement independently or after issue #166 sliding-window TTL (optional)

**Success metrics:**
- Page load time for large result sets < 2s (vs current 10s+ for 10k speeches)
- Memory usage bounded by page size (not total results)
- User feedback: pagination works smoothly
- Error handling: users understand ticket expiration and can recover

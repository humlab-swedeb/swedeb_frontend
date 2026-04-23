# Quick Fix: Parallelize Word Trends API Calls

## Problem

Currently, the word trends page makes two API calls **sequentially**:
1. GET `/word_trends/{word}` - trends data for chart
2. GET `/word_trend_speeches/{word}` - speeches list for table

Total time = 2s + 8s = **10 seconds**

## Solution

Use `Promise.all()` to execute both requests in parallel.

Total time = max(2s, 8s) = **8 seconds** (20% faster!)

## Implementation

### File: `src/pages/WordTrendsPage.vue`

**Before (Sequential):**

```javascript
watchEffect(async () => {
  if (store.submitEventWT) {
    loading.value = true;
    showData.value = false;
    showDataTable.value = false;
    const textString = wtStore.generateStringOfSelected();

    await wtStore.getWordTrendsResult(textString);      // Blocks here
    showDataTable.value = true;
    dataLoadedTable.value = true;

    await wtStore.getWordTrendsSpeeches(textString);    // Starts after first completes
    showData.value = true;
    dataLoaded.value = true;
    loading.value = false;
    store.cancelSubmitWTEvent();
  }
});
```

**After (Parallel):**

```javascript
watchEffect(async () => {
  if (store.submitEventWT) {
    loading.value = true;
    showData.value = false;
    showDataTable.value = false;
    const textString = wtStore.generateStringOfSelected();

    // Execute both requests in parallel
    await Promise.all([
      wtStore.getWordTrendsResult(textString),
      wtStore.getWordTrendsSpeeches(textString)
    ]);

    // Both complete - show all results
    showDataTable.value = true;
    dataLoadedTable.value = true;
    showData.value = true;
    dataLoaded.value = true;
    loading.value = false;
    store.cancelSubmitWTEvent();
  }
});
```

## Testing

1. **Test with fast query** (single year, uncommon word):
   - Should complete in ~1-2 seconds
   - Verify both chart and table appear together

2. **Test with slow query** (full range 1867-2022, common word):
   - Should complete in ~5-8 seconds (not 10+ seconds)
   - Measure time with browser DevTools Network tab

3. **Test error handling**:
   - If one request fails, both should fail gracefully
   - Error messages should display correctly

4. **Test with different filters**:
   - Year ranges, party filters, gender filters
   - Verify both endpoints receive correct parameters

## Deployment

- No backend changes required
- No breaking changes
- Can deploy immediately to production
- Expected improvement: 20-40% faster load times

## Measurements

Before deploying, measure baseline performance:
```bash
# In browser console, time the operation
console.time('word-trends-load');
// Submit query
// When complete:
console.timeEnd('word-trends-load');
```

After deploying, measure again and compare.

## Next Steps

After this quick fix, the more comprehensive solution (ticket-based paging for speeches) is documented in:
- `docs/change_requests/PAGED_WORD_TREND_SPEECHES_DESIGN.md`

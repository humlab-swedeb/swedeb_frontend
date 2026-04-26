import { ref, onUnmounted } from "vue";

export function useClipboardCopy() {
  const linkCopied = ref(false);
  let resetTimer = null;

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
      }
      linkCopied.value = true;
      resetTimer = setTimeout(() => {
        linkCopied.value = false;
        resetTimer = null;
      }, 2000);
    } catch {
      // fallback: ignore clipboard errors silently
    }
  };

  onUnmounted(() => {
    if (resetTimer !== null) {
      clearTimeout(resetTimer);
    }
  });

  return { linkCopied, copyToClipboard };
}

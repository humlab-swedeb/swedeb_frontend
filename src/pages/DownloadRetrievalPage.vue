<template>
  <q-page class="q-px-md q-py-lg" style="max-width: 700px; margin: 0 auto">
    <!-- PENDING state -->
    <template v-if="state === 'pending'">
      <div class="column items-center q-gutter-md q-py-xl">
        <q-spinner-tail color="primary" size="64px" />
        <q-item-label class="text-h6 text-center">
          {{ $t("downloadRetrievalPage.pending") }}
        </q-item-label>
        <q-item-label caption class="text-center">
          {{ $t("downloadRetrievalPage.pendingHint") }}
        </q-item-label>
      </div>
    </template>

    <!-- READY state -->
    <template v-else-if="state === 'ready'">
      <q-card flat bordered class="q-pa-lg">
        <q-card-section>
          <q-item-label class="text-h6 q-mb-sm">
            {{ $t("downloadRetrievalPage.readyTitle") }}
          </q-item-label>
          <q-item-label class="q-mb-md">
            {{ $t("downloadRetrievalPage.readyDescription") }}
          </q-item-label>
          <q-item-label v-if="ticketStatus?.expires_at" caption class="q-mb-lg">
            {{ $t("downloadRetrievalPage.expiresAt") }}
            {{ formattedExpiry }}
          </q-item-label>
        </q-card-section>
        <q-card-actions vertical align="left">
          <q-btn
            color="primary"
            icon="download"
            no-caps
            :label="$t('downloadRetrievalPage.downloadButton')"
            :loading="isDownloading"
            @click="triggerDownload"
          />
        </q-card-actions>
      </q-card>
    </template>

    <!-- FAILED state -->
    <template v-else-if="state === 'failed'">
      <q-banner class="bg-negative text-white q-mb-md" rounded>
        <template v-slot:avatar>
          <q-icon name="error_outline" />
        </template>
        {{ $t("downloadRetrievalPage.failed") }}
        <span v-if="errorDetail"> — {{ errorDetail }}</span>
      </q-banner>
      <q-btn
        flat
        no-caps
        icon="arrow_back"
        :to="'/'"
        :label="$t('downloadRetrievalPage.backToSearch')"
      />
    </template>

    <!-- EXPIRED / NOT FOUND state -->
    <template v-else-if="state === 'expired'">
      <q-card flat bordered class="q-pa-lg">
        <q-card-section>
          <q-item-label class="text-h6 q-mb-sm">
            {{ $t("downloadRetrievalPage.expiredTitle") }}
          </q-item-label>
          <q-item-label>
            {{ $t("downloadRetrievalPage.expired") }}
          </q-item-label>
        </q-card-section>
        <q-card-actions>
          <q-btn
            flat
            no-caps
            icon="arrow_back"
            :to="'/'"
            :label="$t('downloadRetrievalPage.backToSearch')"
          />
        </q-card-actions>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { downloadDataStore } from "src/stores/downloadDataStore";

const POLL_INTERVAL_MS = 5000;

const route = useRoute();
const archiveTicketId = encodeURIComponent(route.params.archiveTicketId);

const state = ref("pending"); // "pending" | "ready" | "failed" | "expired"
const ticketStatus = ref(null);
const errorDetail = ref(null);
const isDownloading = ref(false);

let pollTimer = null;
let pollingActive = false;

const formattedExpiry = computed(() => {
  if (!ticketStatus.value?.expires_at) return "";
  return new Date(ticketStatus.value.expires_at).toLocaleString();
});

async function fetchStatus() {
  try {
    const response = await api.get(`/downloads/${archiveTicketId}`);
    ticketStatus.value = response.data;
    const status = response.data.status;

    if (status === "ready") {
      state.value = "ready";
      stopPolling();
    } else if (status === "error") {
      state.value = "failed";
      errorDetail.value = response.data.error || null;
      stopPolling();
    } else {
      // still pending — keep polling
      state.value = "pending";
    }
  } catch (error) {
    if (error.response?.status === 404) {
      state.value = "expired";
    } else {
      state.value = "failed";
      errorDetail.value =
        error?.response?.data?.detail || error?.message || null;
    }
    stopPolling();
  }
}

async function schedulePoll() {
  await fetchStatus();
  if (pollingActive) {
    pollTimer = setTimeout(schedulePoll, POLL_INTERVAL_MS);
  }
}

function startPolling() {
  pollingActive = true;
  schedulePoll();
}

function stopPolling() {
  pollingActive = false;
  if (pollTimer !== null) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}

async function triggerDownload() {
  isDownloading.value = true;
  try {
    const response = await api.get(`/downloads/${archiveTicketId}/download`, {
      responseType: "blob",
    });
    const store = downloadDataStore();
    const filename = store.getFilenameFromDisposition(
      response.headers,
      `archive_${archiveTicketId}.zip`,
    );
    store.setupDownload(filename, response.data);
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 410) {
      state.value = "expired";
    } else {
      state.value = "failed";
      errorDetail.value =
        error?.response?.data?.detail || error?.message || null;
    }
  } finally {
    isDownloading.value = false;
  }
}

onMounted(() => {
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});
</script>

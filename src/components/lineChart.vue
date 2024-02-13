<template>
  <div>
    <apex-chart
      v-if="dataLoaded"
      :options="chartOptions"
      :series="series"
      type="line"
      height="350"
    />
  </div>
</template>

<script setup>
import { wordTrendsDataStore } from "src/stores/wordTrendsDataStore";
import { ref, watchEffect } from "vue";
import VueApexCharts from "vue3-apexcharts";
const wtStore = wordTrendsDataStore();
const series = ref([]);
const chartOptions = ref({
  chart: {
    type: "line",
    height: 350,
    fontFamily: "Roboto, sans-serif",
    background: "#fff",
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        fontSize: "14px",
      },
    },
  },
  stroke: {
    curve: "smooth",
    width: [3, 3],
  },
  tooltip: {
    style: {
      fontFamily: "Roboto, sans-serif", // Change font family of tooltips
    },
  },
  legend: {
    position: "top", // Placera legenden ovanför diagrammet
    labels: {
      colors: "#000000", // Färg på legendtexten
      fontSize: "16px", // Justera storlek på legendtexten
    },
  },
  colors: ["#ff0000", "#00ff00", "#0000ff"],

  markers: {
    size: 0,
  },
  fill: {
    type: "gradient" / "solid" / "pattern" / "image",
  },
  title: {
    text: "Hello",
    align: "center",
    margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: "Roboto, sans-serif",
      color: "grey",
    },
  },
});

const dataLoaded = ref(false);

watchEffect(() => {
  const wordTrends = wtStore.wordTrends;

  if (wordTrends && wordTrends.length > 0) {
    const categories = wordTrends.map((entry) => parseInt(entry.year));
    const seriesData = Object.keys(wordTrends[0].count).map((word) => ({
      name: word,
      data: wordTrends.map((entry) => entry.count[word]),
    }));

    series.value = seriesData;
    // Uppdatera x-axel kategorier
    chartOptions.value.xaxis.categories = categories;

    // Markera att data har laddats
    dataLoaded.value = true;
  }
});
const ApexChart = VueApexCharts;
</script>

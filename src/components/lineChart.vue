<template>
  <div class="row justify-center">
    <apex-chart
      v-if="dataLoaded"
      :options="chartOptions"
      :series="series"
      type="line"
      class="fit"
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
    fontFamily: "Open-Sans, sans-serif",
    background: "#fcfcfc",
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
    curve: "straight",
    width: 3,
    dashArray: generateDashArray(0),
  },
  tooltip: {
    style: {
      fontFamily: "Open-Sans, sans-serif",
      maxHeight: "30px",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: "#000000", // Färg på legendtexten
      fontSize: "16px", // Justera storlek på legendtexten
    },
  },
  /* colors: ["#ff0000", "#00ff00", "#0000ff"] */

  markers: {
    size: 0,
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
      fontFamily: "Open-Sans, sans-serif",
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
    chartOptions.value.stroke.dashArray = generateDashArray(
      seriesData.length,
      5
    );

    // Markera att data har laddats
    dataLoaded.value = true;
  }
});
const ApexChart = VueApexCharts;

function generateDashArray(totalLines, interval) {
  const dashArray = [];
  const dashValues = [0, 2, 4, 6, 8, 10]; // De olika värdena för dash

  for (let i = 0; i < totalLines; i++) {
    const dashIndex = Math.floor(i / interval) % dashValues.length;
    dashArray.push(dashValues[dashIndex]);
  }
  console.log(dashArray);
  return dashArray;
}
</script>

<style scoped></style>

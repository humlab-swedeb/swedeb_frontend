<template>
  <template v-if="props.toolDataType && props.toolDataType.length > 0">
    <div class="row justify-center q-mt-lg">
      <div ref="chartContainer" id="chartContainer" class="fit"></div>
    </div>
  </template>
  <template v-else>
    <noResults /> <!-- Show a message when there's no data -->
  </template>
</template>

<script setup>
import { reactive, watchEffect, ref } from "vue";
import noResults from "src/components/noResults.vue";
import Highcharts from "highcharts";
import annotations from "highcharts/modules/annotations";
annotations(Highcharts);
import exporting from "highcharts/modules/exporting";
exporting(Highcharts);

const chartContainer = ref(null);
let categories = [];

const props = defineProps({
  toolDataType: Object,
});

const chartOptions = reactive({
  chart: {
    type: "line",
    style: {
      fontFamily: '"Open Sans", sans-serif',
    },
    backgroundColor: "#fcfcfc",
    zooming: {
      type: "xy",
      resetButton: {
        position: {
          x: -40,
          y: 5,
        },
        theme: {
          fill: "white",
          style: {
            color: "#333333",
          },
          states: {
            hover: {
              fill: "#727198",
              style: {
                color: "white",
                fontWeight: "bold",
              },
            },
          },
        },
      },
    },
  },

  title: {
    text: null,
  },

  xAxis: {
    title: {
      text: "År",
    },
    labels: {
      style: {
        fontSize: "14px",
      },
    },
  },

  yAxis: {
    title: {
      text: "Antal",
    },
  },

  plotOptions: {
    line: {
      lineWidth: 3,
    },
  },
  colors: [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
  ],

  tooltip: {
    shared: false,
    style: {
      fontSize: "12px",
      fontFamily: '"Open Sans", sans-serif',
      maxHeight: "100px",
    },
    marker: {
      enabled: true,
    },
  },

  legend: {
    layout: "vertical",
    align: "left",
    verticalAlign: "top",
    itemStyle: {
      fontSize: "14px",
      color: "#333333",
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: "normal",
    },
    symbolWidth: 50,
    symbolHeight: 20,
    navigation: {
      enabled: true,
      activeColor: "#727198",
      inactiveColor: "#E4E4EB",
    },
    /*     labelFormatter: function () {
      const parts = this.name.split(" ");
      let keyword = parts[0];
      let partyIndex = -1;
      console.log(parts);
      console.log(this.name);
    }, */
  },

  credits: {
    enabled: false,
  },
  /* annotations: [
    {
      draggable: false,
      labelOptions: {
        x: 0,
        y: 0,
      },
      labels: [
        {
          point: {
            x: 1,
            y: 0,
            xAxis: 0,
            yAxis: 0,
          },
          text: "1",
        },
      ],
    },
  ],
 */
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 2500,
        },
        chartOptions: {
          chart: {
            height: 400,
          },
        },
      },
    ],
  },
  exporting: {
    filename: "word-trends",
    sourceWidth: 1080,
    menuItemDefinitions: {
      downloadPNG: {
        text: "Ladda ner som PNG",
      },
      downloadSVG: {
        text: "Ladda ner som SVG",
      },
      printChart: {
        text: "Skriv ut diagram",
      },
    },
    buttons: {
      contextButton: {
        menuItems: ["downloadPNG", "downloadSVG", "printChart"],
      },
    },
  },
});

const dataLoaded = ref(false);

watchEffect(() => {
  const toolDataType = props.toolDataType;

  if (toolDataType && toolDataType.length > 0) {
    categories = toolDataType.map((entry) => parseInt(entry.year));
    const seriesData = Object.keys(toolDataType[0].count)
      .map((word) => ({
        name: word,
        data: toolDataType.map((entry) => entry.count[word]),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    //Move "Totalt" to the end of the series
    const totalIndex = seriesData.findIndex((entry) => entry.name === "Totalt");
    if (totalIndex !== -1) {
      const totalEntry = seriesData.splice(totalIndex, 1)[0];
      seriesData.push(totalEntry);
    }

    if (chartContainer.value && chartContainer.value.parentElement) {
      renderChart(chartContainer.value, categories, seriesData);
      //addAnnotations();
      dataLoaded.value = true;
    }
  }
});
const getDashStyle = (seriesIndex) => {
  const styles = ["Solid", "Dash", "Dot", "LongDash", "DashDot"];
  const styleIndex = Math.floor(seriesIndex / 5) % styles.length;
  return styles[styleIndex];
};

function renderChart(container, categories, seriesData) {
  const seriesWithDashStyles = seriesData.map((series, index) => ({
    ...series,
    color: index === seriesData.length - 1 ? "#333333" : null, // Give "Totalt" a different color
    dashStyle: index === seriesData.length - 1 ? "Solid" : getDashStyle(index), // Give "Totalt" a solid line
    legendIndex: series.name === "Totalt" ? -1 : index, // Move "Totalt" to the beginning of the legend
  }));

  Highcharts.chart(container, {
    ...chartOptions,
    xAxis: {
      ...chartOptions.xAxis,
      categories: categories,
    },
    series: seriesWithDashStyles,
  });
}

/* function addAnnotations() {
  const chart = Highcharts.charts[Highcharts.charts.length - 1]; // Get the last created chart

  const annotationYears = [1990, 2004, 2014, 2020];

  annotationYears.forEach((year) => {
    const index = categories.indexOf(year);
    if (index !== -1) {
      chart.addAnnotation({
        draggable: false,
        labelOptions: {
          backgroundColor: "rgba(255, 0, 255, 0.5)",
          verticalAlign: "top",
          y: -1000,
          x: 0,
        },
        labels: [
          {
            point: {
              xAxis: 0,
              yAxis: 0,
              x: index,
              y: 0, // Adjust the y-value as needed
            },
            text: `Year ${year}`,
          },
        ],
      });
    }
  });
} */
</script>

<style scoped></style>

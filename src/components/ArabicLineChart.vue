<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 class="text-md font-bold text-slate-800 mb-4 font-sans">{{ title }}</h3>
    <div class="relative">
      <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-auto overflow-visible">
        <!-- Grid lines -->
        <g v-for="(ratio, idx) in [0, 0.25, 0.5, 0.75, 1]" :key="idx">
          <line
            :x1="padding"
            :y1="padding + ratio * (height - padding * 2)"
            :x2="width - padding"
            :y2="padding + ratio * (height - padding * 2)"
            stroke="#F1F5F9"
            stroke-width="1"
            stroke-dasharray="4 4"
          />
          <text
            :x="width - padding + 5"
            :y="padding + ratio * (height - padding * 2) + 4"
            fill="#94A3B8"
            font-size="9"
            text-anchor="start"
            class="font-mono font-semibold"
          >
            {{ Math.round(maxVal - ratio * range) }}%
          </text>
        </g>

        <!-- Line Path -->
        <polyline
          fill="none"
          stroke="#2563EB"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          :points="points"
        />

        <!-- Gradient Fill under the line -->
        <path
          :d="`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`"
          fill="url(#grad)"
          opacity="0.1"
        />

        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Data Nodes -->
        <g v-for="(node, i) in nodes" :key="i" class="group cursor-pointer">
          <circle :cx="node.x" :cy="node.y" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
          <circle :cx="node.x" :cy="node.y" r="8" fill="#2563EB" opacity="0" class="hover:opacity-20 transition" />
        </g>
      </svg>

      <!-- Labels below chart -->
      <div class="flex justify-between mt-3 px-6 text-[10px] font-semibold text-slate-500 font-sans">
        <span v-for="(d, i) in data" :key="i">{{ d.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface LineChartItem {
  label: string;
  value: number;
}

const props = defineProps<{
  data: LineChartItem[];
  title: string;
}>();

const width = 500;
const height = 180;
const padding = 30;

const maxVal = computed(() => Math.max(...props.data.map((d) => d.value), 10));
const minVal = 0;
const range = computed(() => maxVal.value - minVal);

const nodes = computed(() => {
  const rangeVal = range.value || 1;
  return props.data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (props.data.length - 1 || 1);
    const y = height - padding - ((d.value - minVal) / rangeVal) * (height - padding * 2);
    return { x, y };
  });
});

const points = computed(() => {
  return nodes.value.map((node) => `${node.x},${node.y}`).join(" ");
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 class="text-md font-bold text-slate-800 mb-4 font-sans">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(item, idx) in data" :key="idx" class="space-y-1">
        <div class="flex justify-between items-center text-xs font-semibold text-slate-600">
          <span>{{ item.label }}</span>
          <span class="font-mono">{{ item.value }}%</span>
        </div>
        <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            :class="['h-full rounded-full transition-all duration-1000 ease-out', item.color || 'bg-blue-600']"
            :style="{ width: `${Math.min(100, Math.round((item.value / maxVal) * 100))}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

const props = defineProps<{
  data: BarChartItem[];
  title: string;
}>();

const maxVal = computed(() => {
  return Math.max(...props.data.map((d) => d.value), 10);
});
</script>

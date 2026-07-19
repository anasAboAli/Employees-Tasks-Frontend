<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
    <div>
      <h3 class="text-md font-bold text-slate-800 mb-4 font-sans">{{ title }}</h3>
    </div>
    <div class="flex items-center justify-around my-2">
      <div class="relative flex items-center justify-center w-28 h-28">
        <!-- Ring diagram -->
        <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
          <path
            class="text-slate-100"
            stroke-width="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <!-- Completed Segment (Green) -->
          <path
            class="text-emerald-500"
            stroke-width="3.5"
            :stroke-dasharray="`${pCompleted}, 100`"
            stroke-linecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <!-- Pending Segment (Blue) -->
          <path
            class="text-blue-500"
            stroke-width="3.5"
            :stroke-dasharray="`${pPending}, 100`"
            :stroke-dashoffset="-pCompleted"
            stroke-linecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="absolute flex flex-col items-center">
          <span class="text-xl font-extrabold text-slate-800 font-mono">{{ total }}</span>
          <span class="text-[9px] text-slate-400 font-bold">إجمالي المهام</span>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center space-x-2 space-x-reverse text-xs font-semibold">
          <span class="w-3 h-3 rounded-full bg-emerald-500" />
          <span class="text-slate-600">مكتملة ({{ pCompleted }}%)</span>
        </div>
        <div class="flex items-center space-x-2 space-x-reverse text-xs font-semibold">
          <span class="w-3 h-3 rounded-full bg-blue-500" />
          <span class="text-slate-600">قيد العمل ({{ pPending }}%)</span>
        </div>
        <div class="flex items-center space-x-2 space-x-reverse text-xs font-semibold">
          <span class="w-3 h-3 rounded-full bg-rose-500" />
          <span class="text-slate-600">متأخرة ({{ pLate }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  completed: number;
  pending: number;
  late: number;
  title: string;
}>();

const total = computed(() => props.completed + props.pending + props.late || 1);
const pCompleted = computed(() => Math.round((props.completed / total.value) * 100));
const pPending = computed(() => Math.round((props.pending / total.value) * 100));
const pLate = computed(() => Math.round((props.late / total.value) * 100));
</script>

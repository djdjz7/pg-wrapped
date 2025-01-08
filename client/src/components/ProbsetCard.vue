<script setup lang="ts">
import { dateToString } from '@/utils';
defineProps<{
  probset: {
    probset: {
      title: string;
      id: string;
      openTime: string;
      closeTime: string;
    };
    total: number;
    ac: number;
    acRate: number;
  }
}>();
</script>

<template>
  <div rounded-xl shadow-lg p-4 flex="~ col gap-2">
    <span text-2xl font-bold>{{ probset.probset.title }}</span>
    <span>{{ dateToString(probset.probset.openTime) }} - {{ dateToString(probset.probset.closeTime) }}</span>
    <span self-end text-xl font-bold text-red>{{ probset.ac }}/{{ probset.total }} = {{ (probset.acRate *
      100).toFixed(2) }}%</span>
  </div>
</template>

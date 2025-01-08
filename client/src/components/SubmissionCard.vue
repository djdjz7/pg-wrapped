<script setup lang="ts">
import { dateToString } from '@/utils';
import StatusBadge from '@/components/StatusBadge.vue';
defineProps<{
  submission: {
    result: string;
    time: string;
    language: string;
    problemTitle: string;
    probsetTitle: string;
  };
}>();
</script>

<template>
  <div rounded-xl shadow-lg p-4 flex="~ col">
    <span text-2xl font-bold>{{ submission.problemTitle }}</span>
    <span text-gray>{{ submission.probsetTitle }}</span>
    <StatusBadge m-t-2 :status="submission.result" />
    <span m-t-2>{{ submission.language }}</span>
    <span>{{ dateToString(submission.time) }}</span>
  </div>
</template>

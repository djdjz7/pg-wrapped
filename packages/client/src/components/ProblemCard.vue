<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge.vue';
defineProps<{
  problem: {
    title: string;
    probsetTitle: string;
    status: string;
    submissionCount: number;
    acceptedCount: number;
  };
}>();
</script>

<template>
  <div rounded-xl shadow-lg p-4 flex="~ col">
    <span text-2xl font-bold>{{ problem.title }}</span>
    <span text-sm text-gray>{{ problem.probsetTitle }}</span>
    <StatusBadge m-t-2 :status="problem.status" />
    <span m-t-2><span font-bold>{{ problem.submissionCount }} 次</span>提交</span>
    <span><span font-bold>{{ problem.acceptedCount }} 次</span>通过</span>

  </div>
</template>

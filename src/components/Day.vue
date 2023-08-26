<script setup lang='ts'>
  import { computed } from 'vue';
  import type { Event } from '@/types';
  import type { EventDescription } from '@/types';
  import { useISOStringWithTimezone } from '@/tools';

  const emit = defineEmits<{
    (e: 'showEvent', evt: EventDescription): void
  }>();

  interface Props {
    data: Event,
    nowDate: string,
  }
  const props = defineProps<Props>();
  const dt: Date = new Date(props.data.date);
  const now: Date = new Date(props.nowDate);
  const classWeekEnd = computed<Boolean>(() => {
    return [0, 6].includes(dt.getDay());
  });
  const day = computed<Number>(() => {
    return dt.getDate();
  });
  const classToday = computed<Boolean>(() => {
    return useISOStringWithTimezone(now).split('T')[0] === props.data.date;
  });
  const classPrevDay = computed<Boolean>(() => {
    return dt.getTime() < now.getTime();
  });
</script>

<template>
  <div :class="['day-wrap', {prev: classPrevDay}]">
    <div
        :class="['day', {weekend: classWeekEnd, today: classToday, prev: classPrevDay}]"
    >
      {{ day }}
    </div>
    <div
      v-for="(ev, i) in props.data.events"
      :key="i"
      :title="ev.event"
      class="event-row"
      @click="emit('showEvent', ev)"
    >
      {{ ev.event }}
    </div>
  </div>
</template>

<style scoped>
  .day-wrap{
    box-sizing: border-box;
    outline: 1px solid #eee;
    padding: 5px 5px;
    overflow-y: auto;
    transition: .3s;
  }
  .day-wrap:hover{
    outline: 1px solid #ccc;
    z-index: 2;
  }
  .day{
    text-align: right;
  }
  .prev{
    color: var(--grey1);
    background: #fafaf9;
  }
  .weekend{
    color: dodgerblue;
  }
  .today{
    color: #16d0b1;
  }
  .event-row{
    background: #f3dada;
    font-size: 13px;
    padding: 1px 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
    border-radius: 6px;
    margin-bottom: 2px;
  }
</style>
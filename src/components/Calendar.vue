<script setup lang='ts'>
  import { computed, ref } from 'vue';
  import type { Ref } from 'vue';
  import Day from '@/components/Day.vue';
  import MonthSwitcher from '@/components/MonthSwitcher.vue';
  import type { Event, EventDescription } from '@/types';
  import {
    useWeekDays,
    useISOStringWithTimezone,
    usePrevDays,
    useCurrentDays,
    useNextDays,
  } from '@/tools';

  const gridRows = 6;
  const gridColumns = 7;
  const cellsCount = gridColumns * gridRows;
  const now: Ref<Date> = ref(new Date());
  const [nowString]: string[] = useISOStringWithTimezone(now.value).split('T');
  const weekDays: string[] = useWeekDays(now.value);

  const month = computed<string>(() => {
    const fmt = new Intl.DateTimeFormat("ru-RU", { month: "long"});
    return fmt.format(now.value).toUpperCase();
  });

  const cells = computed<Event[]>( () => {
    const prevMonthCal = usePrevDays(now.value);
    const currentMonthCal = useCurrentDays(now.value);
    const nextMonthCal = useNextDays(now.value, (cellsCount - prevMonthCal.length - currentMonthCal.length) );
    return prevMonthCal.concat(currentMonthCal, nextMonthCal);
  } );

  const switchMonth = (isNext: Boolean): void => {
    const dt = new Date(now.value);
    dt.setMonth(dt.getMonth() + (isNext ? 1 : -1));
    now.value = dt;
  };
  const selectedEvent = ref('');
  const showEvent = (event: EventDescription): undefined => {
      selectedEvent.value = event.descr;
  };
</script>

<template>
  <div class="wrap">
    <div
      v-if="selectedEvent"
      class="selected-event-wrapper"
      @click="selectedEvent = ''"
    >
      <div class="event-decription">
        {{ selectedEvent }}
      </div>
    </div>
    <header>
      <MonthSwitcher
        :month-name="month"
        @next-month="switchMonth(true)"
        @prev-month="switchMonth(false)"
      />
      <div class="year"> {{ now.getFullYear() }} </div>
    </header>
    <div class="week-day-wrap">
      <div
        v-for="(wd, i) in weekDays"
        :key="i"
      >
        <span :class="{weekends: [5, 6].includes(i)}">{{ wd }}</span>
      </div>
    </div>
    <div class="grid-wrap">
      <Day
          v-for="c in cells"
          :key="c.date"
          :data="c"
          :now-date="nowString"
          @show-event="showEvent"
      />
    </div>
  </div>
</template>

<style scoped>
  .selected-event-wrapper{
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(24, 24, 24, 0.55);
  }
  .event-decription{
    padding: 30px;
    background: white;

  }
  .wrap{
    background: white;
    border-radius: 20px;
    width: fit-content;
    margin: 10px;
    padding: 20px;
  }
  header{
    display: flex;
    justify-content: space-between;
  }
  .year{
    color: dodgerblue;
  }
  .week-day-wrap{
    display: grid;
    grid-template-columns: repeat( v-bind(gridColumns), 110px);
    grid-gap: 1px;
    text-align: right;
    margin-bottom: 6px;
    font-size: 12px;
  }
  .grid-wrap{
    display: grid;
    grid-template-columns: repeat( v-bind(gridColumns), 110px);
    grid-template-rows: repeat( v-bind(gridRows), 110px);
    grid-gap: 1px;
  }
  .weekends{
    color: var(--grey1);
  }
</style>
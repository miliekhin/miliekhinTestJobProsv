import events from '@/assets/events.json';
import type {Event, EventDescription} from '@/types';

export function useWeekDays(indt: Date): string[] {
    const dt = new Date(indt);
    const days: string[] = [];
    dt.setDate(dt.getDate() - dt.getDay() + 1);
    const monday = dt.getDate();
    const fmt = new Intl.DateTimeFormat("ru-RU", { weekday: "long"});
    for(let i = 0; i < 7; i++) {
        dt.setDate(monday + i)
        days.push(fmt.format(dt).toUpperCase());
    }
    return days;
}

export function useISOStringWithTimezone(date: Date): string {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) +
        ':' + pad(tzOffset % 60);
}

const dayEvents = (date: string): EventDescription[] => {
    return events.filter((ev) => ev.date === date).map((ev) => {
        return { event: ev.event, descr: ev.description };
    });
};

const eventObject = (date: Date): Event => {
    const [datestr] = useISOStringWithTimezone(date).split('T');
    return { date: datestr, events: dayEvents(datestr) };
}

export function usePrevDays(indt: Date): Event[] {
    const dt = new Date(indt);
    const days = [];
    dt.setDate(1);
    const weekDay = dt.getDay();
    const daysBeforeFirstMonthDay = (weekDay ? weekDay - 1 : 7);
    const y = dt.getFullYear();
    const m = dt.getMonth();
    const prevMonthLastDate = new Date(m ? y : y - 1, m ? m : 11, 0).getDate();
    const dateBeforeFirstMonthDay = prevMonthLastDate - daysBeforeFirstMonthDay + 1;
    for(let i = 0; i < daysBeforeFirstMonthDay; i++) {
        const date = new Date(m ? y : y - 1, m ? m - 1: 11, dateBeforeFirstMonthDay + i);
        days.push(eventObject(date));
    }
    return days;
}

export function useCurrentDays(indt: Date): Event[] {
    const dt = new Date(indt);
    const days = [];
    const y = dt.getFullYear();
    const m = dt.getMonth();
    const daysInCurrentMonth = new Date(y, m + 1, 0).getDate();
    for(let i = 1; i <= daysInCurrentMonth; i++) {
        const date = new Date(y, m, i);
        days.push(eventObject(date));
    }
    return days;
}

export function useNextDays(indt: Date, daysCount: number): Event[] {
    const dt = new Date(indt);
    const days = [];
    dt.setDate(1);
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    if (m === 12) {
        m = 0;
        y += 1;
    }
    for( let i = 1; i <= daysCount; i++) {
        const date = new Date(y, m, i);
        days.push(eventObject(date));
    }
    return days;
}
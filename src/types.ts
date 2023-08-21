export type EventDescription = {
    event: string,
    descr: string,
}

export type Event = {
    date: string,
    events: EventDescription[],
}

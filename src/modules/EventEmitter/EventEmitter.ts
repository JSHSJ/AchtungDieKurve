import { generateUUID } from '../../util/generateUUID';

export abstract class EventEmitter<T> {
    private listenerMap: Record<string, (event: T) => void> = {};

    private get listeners() {
        return Object.values(this.listenerMap);
    }

    public subscribe(listener: (event: T) => void): string {
        const id = generateUUID('listener');
        this.listenerMap[id] = listener;
        return id;
    }

    public unsubscribe(id: string) {
        delete this.listenerMap[id];
    }

    public emit(event: T) {
        this.listeners.forEach((listener) => listener(event));
    }
}

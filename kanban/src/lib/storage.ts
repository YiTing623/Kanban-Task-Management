const TASKS_KEY = 'kanban.tasks.v1';
const FILTERS_KEY = 'kanban.filters.v1';

export const storageKeys = { tasks: TASKS_KEY, filters: FILTERS_KEY };

export function load<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

export function save<T>(key: string, value:  T){
    if(typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}
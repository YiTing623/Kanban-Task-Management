export type Status = 'scheduled' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    assignee: string;
    tags: string[];
    createdAt: number;
    dueDate?: string;
    priority?: Priority;
}
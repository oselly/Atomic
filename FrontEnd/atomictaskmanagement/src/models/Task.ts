import type { User } from './User';

export class Task {
    entityId?: string;
    id?: number;
    title: string = '';
    description?: string;
    createdByUserId?: number;
    createdBy?: User;
    createdDate?: Date | null;
    dueDate?: Date | null;
    isCompleted?: boolean;
    completedDate?: Date | null;
    isCancelled?: boolean;
    cancelledDate?: Date | null;
    lastModifiedDate?: Date | null;
    assignedTo?: User;
    assignedToUserId?: number;


    constructor(init: Partial<Task>) {
        Object.assign(this, init);
    }

    setCompleted(completedUserId: number): void
    {
        this.isCompleted = true;
        this.completedDate = new Date();
        this.createdByUserId = completedUserId;
        this.lastModifiedDate = new Date();
    }

    setCancelled(isCancelled: boolean): void {
        this.isCancelled = isCancelled;
        this.cancelledDate = isCancelled ? new Date() : null;
        this.lastModifiedDate = new Date();
    }
};


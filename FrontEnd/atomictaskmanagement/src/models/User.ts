export class User {
    entityId?: string;
    id?: number;
    name: string = "";
    isActive?: boolean;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
};


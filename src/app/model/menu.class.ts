import {Role} from './role.class';

export interface Menu {
id?: number;
url?: string;
name?: string;
description?: string;
childrens?: Menu[];
orderPriority?: number;
createdDate?: Date;
role?: Role[];
level?: number;
expand?: boolean;
parent?: Menu;
parentId?: number;
roleId?: number;
}

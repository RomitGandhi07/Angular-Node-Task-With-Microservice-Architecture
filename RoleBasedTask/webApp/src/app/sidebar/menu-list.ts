export class MenuItem {
    constructor(
        public name: string,
        public route: string,
        public toolTip: string,
        public icon: string = ''
    ) {}
}

export const menuList = [
    new MenuItem('Users', 'users', 'Users', 'users'),
    new MenuItem('Roles', 'roles', 'Roles', 'user-tag'),
];
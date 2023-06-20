export interface IRoute {
    key: string;
    path: `/${string}`;
    element: () => JSX.Element;
    standAlone?: boolean;
    name?: string;
    parent?: string;
    menuKey?: string;
}
export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface IMenu {
	name: string;
	icon: {
		type: string;
		value: string;
	};
	localizedNames: {
		[key: string]: string;
	};
	resource: string;
	path?: string;
	children?: IMenu[];
}
export type GridWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface WithGrid {
	span: GridWidth;
	offset: GridWidth;
}

export type WithOptionalGrid = Partial<WithGrid>;

export interface FieldCore extends WithVisibility, WithOptionalLabel, WithOptionalGrid {
	key: string;
	type: FieldType;
	required?: boolean;
}

export enum UiType {
	TEXT_INPUT = 'text-input',
	DATE = 'date',
	CHECKBOX = 'checkbox',
	SELECT = 'select',
	CASCADING_SELECT = 'cascading-select',
	IMAGE = 'image',
	FILE_UPLOAD = 'file-upload',
	HTML_INPUT = 'html-input',
	MAP_ADDRESS_PICKER = 'map-address-picker',
	DATETIME = 'datetime',
	TIME = 'time',
}

export enum Locale {
	MONGOLIAN = 'mn',
	ENGLISH = 'en',
	CHINESE = 'zh',
	SPANISH = 'es',
	FRENCH = 'fr',
	GERMAN = 'de',
	ITALIAN = 'it',
	JAPANESE = 'ja',
	KOREAN = 'ko',
	RUSSIAN = 'ru',
	PORTUGUESE = 'pt',
}

interface IFieldCore {
	key: string;
	label?: string;
	required?: boolean;
	uiType?: UiType;
}

interface WithValue {
	value?: unknown;
}

interface NormalFieldCore extends IFieldCore, WithValue {
	type: FieldType.NORMAL;
	uiType: UiType;
}

interface TextInputField extends NormalFieldCore {
	uiType: UiType.TEXT_INPUT;
	number?: boolean;
	numeric?: boolean;
	length?: number;
	maxLength?: number;
	maxValue?: number;
	minLength?: number;
	minValue?: number;
	multiLine?: boolean;
	secret?: boolean;
}

interface CheckboxField extends NormalFieldCore {
	uiType: UiType.CHECKBOX;
}

type SelectField = {
	uiType: UiType.SELECT;
	multiple?: boolean;
} & (
	| {
			options: SelectOption[];
	  }
	| {
			optionsApi: {
				uri: string;
				queryParams?: string[];
			};
	  }
	| {
			refCode: string;
	  }
) &
	NormalFieldCore;

export interface WithLabel {
	label: string;
	localizedLabel?: Partial<Record<Locale, string>>;
}

export type WithOptionalDescription = Partial<WithDescription>;

export interface WithDescription {
	description: string;
	localizedDescription?: Partial<Record<Locale, string>>;
}

export interface SelectOption extends WithLabel, WithOptionalDescription {
	value: string | number;
}

interface CascadingSelectField extends NormalFieldCore {
	uiType: UiType.CASCADING_SELECT;
	refCode: string;
}

interface DateInput extends NormalFieldCore {
	uiType: UiType.DATE;
	format: string;
}

interface DatetimeInput extends NormalFieldCore {
	uiType: UiType.DATETIME;
	format: string;
}
interface TimeInput extends NormalFieldCore {
	uiType: UiType.TIME;
	format: string;
}

interface ImageInput extends NormalFieldCore {
	uiType: UiType.IMAGE;
	multiple?: boolean;
}

interface FileUpload extends NormalFieldCore {
	uiType: UiType.FILE_UPLOAD;
	mimeType: string;
	useFileName: boolean;
	folderPath?: string;
	prefix?: string;
}

export interface HtmlInput extends NormalFieldCore {
	uiType: UiType.HTML_INPUT;
	allowedTags?: string[];
	allowedAttributes?: Record<string, string[]>;
}

export interface MapAddressPicker extends NormalFieldCore {
	uiType: UiType.MAP_ADDRESS_PICKER;
	suggestApi: {
		uri: string;
		searchKey: string;
	};

	retrieveApi: {
		uri: string;
	};
}

export interface WithVisibility {
	visibility?: IVisibility;
}

export interface WithLabel {
	label: string;
	localizedLabel?: Partial<Record<Locale, string>>;
}
export type WithOptionalLabel = Partial<WithLabel>;

export interface WithLabel {
	label: string;
	localizedLabel?: Partial<Record<Locale, string>>;
}

type VisibilityType = { value: unknown } | { hasValue: boolean } | { valueNotEquals: unknown };

export type IVisibility = VisibilityType & { key: string };

export enum FormType {
	NORMAL = 'normal',
	TABBED = 'tabbed'
}

export enum FieldType {
	NORMAL = 'normal',
	RENDER = 'render',
	ARRAY = 'array',
	OBJECT = 'object',
	GROUP = 'group',
}

export type INormalField = TextInputField | CheckboxField | SelectField | DateInput | TimeInput | DatetimeInput | CascadingSelectField | MapAddressPicker | FileUpload | HtmlInput;

export type IFormField = (RenderField | INormalField | ArrayField | ObjectField | FieldGroup) & {
	// TODO: try to remove these
	isArrayElement?: boolean;
	groupPath?: string;
};

export enum RenderType {
	TEXT = 'text',
	IMAGE = 'image',
	BOOLEAN = 'boolean',
	LINK = 'link',
	TABLE = 'table',
}

interface RenderFieldCore extends WithOptionalLabel {
	key: string;
	type: FieldType.RENDER;
	renderType: RenderType;
	optional?: boolean;
	span?: GridWidth;
	offset?: GridWidth;
}

interface TextRender extends RenderFieldCore {
	renderType: RenderType.TEXT;
}

interface LinkRender extends RenderFieldCore {
	renderType: RenderType.LINK;
	uri: string;
	newTab?: boolean;
}

interface BooleanRender extends RenderFieldCore {
	renderType: RenderType.BOOLEAN;
}

interface ImageRender extends RenderFieldCore {
	renderType: RenderType.IMAGE;
	multiple?: boolean;
}

interface TableRender extends RenderFieldCore {
	renderType: RenderType.TABLE;
	columns: { key: string; label: string }[];
}

export type RenderField = TextRender | BooleanRender | ImageRender | LinkRender | TableRender;

export interface ArrayField extends FieldCore {
	type: FieldType.ARRAY;
	element: IFormField;
}

export interface ObjectField extends FieldCore {
	type: FieldType.OBJECT;
	fields: IFormField[];
}

export interface FieldGroup extends WithVisibility, WithOptionalLabel {
	type: FieldType.GROUP;
	fields: IFormField[];
}
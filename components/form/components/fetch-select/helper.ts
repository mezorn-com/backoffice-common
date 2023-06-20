export type SelectValue  = string | string[] | null;

export const getTransformedValue = (value: SelectValue, multiple: boolean): SelectValue => {
    if (!value) {
        return null;
    }
    if (multiple) {
        if (Array.isArray(value)) {
            return value;
        }
        return [value];
    }
    if (Array.isArray(value)) {
        return value?.[0] ?? null;
    }
    return value;
}
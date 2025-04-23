import { AnnotationProps } from "@/@types/annotation";

export type LayoutBlock =
    | { type: "row"; items: AnnotationProps[] }
    | { type: "full"; items: [AnnotationProps] };

export function formatLayout(items: AnnotationProps[]): LayoutBlock[] {
    const layout: LayoutBlock[] = [];

    for (let i = 0; i < items.length;) {
        if (i + 1 < items.length) {
            layout.push({ type: "row", items: [items[i], items[i + 1]] });
            i += 2;
        }
        if (i < items.length) {
            layout.push({ type: "full", items: [items[i]] });
            i += 1;
        }
    }

    return layout;
}

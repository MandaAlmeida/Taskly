export function FormatDate(dateStr: string): number {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day).getTime(); // Convertendo para timestamp
}


export function formatDatePTBR(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
}
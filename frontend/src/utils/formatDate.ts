export function formatDatePTBR(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
}


export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}
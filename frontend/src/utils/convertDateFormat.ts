export function convertDateFormat(dateString: Date | string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0'); // Pega o dia e garante que tenha 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Pega o mês e garante que tenha 2 dígitos (Lembre-se que o mês é 0-indexed)
    const year = date.getFullYear(); // Pega o ano

    return `${year}-${month}-${day}`;
}

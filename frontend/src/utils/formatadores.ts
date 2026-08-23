// Formata valores de enum para exibição na interface
export function formatarEnum(valor: string): string {
    return valor
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

// Converte o tempo total em minutos para horas e minutos
export function formatarTempoPreparo(
    totalMinutos: number,
): string {
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60

    if (horas === 0) {
        return `${minutos} min`
    }

    if (minutos === 0) {
        return `${horas}h`
    }

    return `${horas}h ${minutos}min`
}
export const compareCardNumbers = (a: string, b: string): number => {
    const numericOnly = /^\d+$/;
    const yearPattern = /^(\d{4})-(\d+)$/;       // e.g., "1954-11"
    const hybridPattern = /^([A-Z]+)-(\d+)$/i;   // e.g., "TT-5"

    const parseCard = (val: string) => {
        if (numericOnly.test(val)) {
            return { type: 'number', numeric: parseInt(val, 10) };
        }

        const yearMatch = val.match(yearPattern);
        if (yearMatch) {
            return {
                type: 'year',
                year: parseInt(yearMatch[1], 10),
                number: parseInt(yearMatch[2], 10),
            };
        }

        const hybridMatch = val.match(hybridPattern);
        if (hybridMatch) {
            return {
                type: 'hybrid',
                prefix: hybridMatch[1].toUpperCase(),
                number: parseInt(hybridMatch[2], 10),
            };
        }

        return {
            type: 'string',
            value: val.toUpperCase(),
        };
    };

    const cardA = parseCard(a);
    const cardB = parseCard(b);

    // Pure numbers always come first
    if (cardA.type === 'number' && cardB.type !== 'number') return -1;
    if (cardA.type !== 'number' && cardB.type === 'number') return 1;
    if (cardA.type === 'number' && cardB.type === 'number') return Number(cardA.numeric) - Number(cardB.numeric);

    // Year-number types come next
    if (cardA.type === 'year' && cardB.type !== 'year') return -1;
    if (cardA.type !== 'year' && cardB.type === 'year') return 1;
    if (cardA.type === 'year' && cardB.type === 'year') {
        if (cardA.year !== cardB.year) return Number(cardA.year) - Number(cardB.year);
        return Number(cardA.number) - Number(cardB.number);
    }

    // Hybrid (prefix-number)
    if (cardA.type === 'hybrid' && cardB.type === 'hybrid') {
        const prefixCompare = (cardA.prefix as string).localeCompare(cardB.prefix as string);
        if (prefixCompare !== 0) return prefixCompare;
        return Number(cardA.number) - Number(cardB.number);
    }

    if (cardA.type === 'hybrid' && cardB.type === 'string') return -1;
    if (cardA.type === 'string' && cardB.type === 'hybrid') return 1;

    // Fallback: compare as strings
    return (cardA.value || '').localeCompare(cardB.value || '');
}
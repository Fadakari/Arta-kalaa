export function convertPersianToEnglish(input: string | number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return input
        .toString()
        .replace(/[۰-۹]/g, (digit) => persianDigits.indexOf(digit).toString());
}

export function convertNumberToPersian(input: string | number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return input
        ?.toString()
        .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

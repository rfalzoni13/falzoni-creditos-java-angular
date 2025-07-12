import moment from 'moment';

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

function formatDate(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
}

export { 
    formatCurrency,
    formatPercentage,
    formatDate
};
export default function formatISODate(isoString) {
    const date = new Date(isoString);

    // Extract day, month, and year in UTC to avoid timezone-related bugs
    const day = String(date.getUTCDate()).padStart(2, '0'); // Adds leading zero to day
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }); // Short month name in UTC
    const year = date.getUTCFullYear(); // Year in UTC

    return `${day} ${month} ${year}`;
}

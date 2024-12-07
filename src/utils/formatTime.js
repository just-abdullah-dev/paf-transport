export default function convertTo12HourFormat(time) {
    // Split the time string into hours and minutes
    const [hour, minute] = time.split(":").map(Number);
  
    // Determine whether it's AM or PM
    const period = hour >= 12 ? "PM" : "AM";
  
    // Convert hour to 12-hour format
    const hour12 = hour % 12 || 12; // 12-hour format, with 0 becoming 12
  
    // Return the formatted time
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  }
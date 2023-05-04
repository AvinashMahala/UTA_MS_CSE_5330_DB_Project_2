export function formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return (
      date.getDate().toString().padStart(2, "0") +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getFullYear().toString().substr(-2)
    );
  }
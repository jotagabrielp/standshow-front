export const formatApiFriendlyDate = (date: Date) => {
    const d = date.getUTCDate().toString().length > 1 ? date.getUTCDate() : "0" + date.getUTCDate().toString()
    const m = (date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1).toString();
    const y = date.getFullYear();
    const h = date.getHours().toString().length > 1 ? date.getHours() : "0" + date.getHours().toString();
    const min = date.getMinutes().toString().length > 1 ? date.getMinutes() : "0" + date.getMinutes().toString();
    return `${y}-${m}-${d} ${h}:${min}`
}
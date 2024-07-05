export const isEmail = (s) => {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}
export const isMobile = (s) => {
    return /^1[0-9]{10}$/.test(s)
}
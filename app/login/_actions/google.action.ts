'use server'
export const googleAction = async () => {
    return  fetch('http://localhost:3333/api/v1.0/google')
}
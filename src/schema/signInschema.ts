import {z} from 'zod'

export const signInschema = z.object({
    Identifier:z.string(),
    password:z.string()
})
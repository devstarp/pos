export {lang} from '../assets/lang/en'
// export const host = "http://localhost:8091"
// export const pHost = "http://localhost:8091/api"

// remote server
// export const host = "http://128.199.53.5:8091"
// export const pHost = "http://128.199.53.5:8091/api"

export const host = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/v1.0"
export const pHost = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/v1.0"
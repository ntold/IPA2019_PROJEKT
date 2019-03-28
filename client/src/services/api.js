/*
 * Author:      Nico Berchtold
 * File name:   api.js
 * Version:     1.0
 * Description: API calls to the Backend
 *              with the JWT Token in the header
 *        
 */

import axios from 'axios'
import store from "@/store/store";


export default () => {
    return axios.create({
        baseURL: `http://localhost:8081/`,
        headers: { Authorization: `Bearer ${store.state.token}` }
    })
}

import axios from 'axios'
import JwtService from '@/@core/auth/jwt/jwtService'

// eslint-disable-next-line import/extensions
import { BASE_URL_PRODUCTS } from '@/config.js' // Adjust the path if necessary

const jwtService = new JwtService(axios)

const ProductService = {
  async getProducts() {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      const response = await axios.get(BASE_URL_PRODUCTS)
      return response.data.data // Assuming the response data has a 'data' property containing the products
    } catch (error) {
      throw new Error('Error fetching products')
    }
  },

  async getProduct(productId) {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      const response = await axios.get(`${BASE_URL_PRODUCTS}/${productId}`)
      return response.data.data // Assuming the response data has a 'data' property containing the product
    } catch (error) {
      throw new Error('Error fetching product')
    }
  },

  async createProduct(productData, image) {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      const formData = new FormData()
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key])
      })

      // Append the image file to formData
      formData.append('image', image)

      const response = await axios.post(BASE_URL_PRODUCTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data // Assuming the response data has a 'data' property containing the created product
    } catch (error) {
      throw new Error('Error creating product')
    }
  },

  async updateProduct(productId, productData, image) {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      console.log('Product Data:', productData) // Log the productData object

      // Create a JSON object containing the product data

      // const requestData = {
      //   ...productData,
      //   image,
      // }
      const formData = new FormData()
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key])
      })

      // Append the image file to formData
      formData.append('image', image)

      const response = await axios.post(`${BASE_URL_PRODUCTS}/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/json', // Set content type to JSON
        },
      })
      return response.data.data
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`)
    }
  },

  async deleteProduct(productId) {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      const response = await axios.delete(`${BASE_URL_PRODUCTS}/${productId}`)
      return response.data.message // Assuming the response data has a 'message' property containing the success message
    } catch (error) {
      throw new Error('Error deleting product')
    }
  },
  async searchForProduct(searchQuery) {
    try {
      jwtService.triggerRequestInterceptor() // Trigger request interceptor
      const response = await axios.get('http://127.0.0.1:8000/api/products-search', {
        params: {
          search: searchQuery,
        },
      })
      return response.data.data // Assuming the response data has a 'data' property containing the search results
    } catch (error) {
      throw new Error('Error searching products')
    }
  },
}

export default ProductService

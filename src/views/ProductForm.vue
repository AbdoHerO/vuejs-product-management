<template>
  <b-card>

    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img ref="previewEl" rounded :src="formData.imagePreview" height="80" />
        </b-link>
        <!--/ avatar -->
      </b-media-aside>

      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" size="sm" class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()">
          Upload
        </b-button>
        <b-form-file ref="refInputEl" v-model="formData.image" accept=".jpg, .png, .gif" :hidden="true" plain
          @input="inputImageRenderer" @change="handleFileChange($event)"/>
        <!--/ upload button -->

        <!-- reset -->
        <b-button @click.prevent="resetForm" v-ripple.400="'rgba(186, 191, 199, 0.15)'" variant="outline-secondary" size="sm" class="mb-75 mr-75">
          Reset
        </b-button>
        <!--/ reset -->
        <b-card-text>Allowed JPG, GIF or PNG. Max size of 800kB</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group label="name" label-for="name">
            <b-form-input v-model="formData.name" placeholder="name" name="name" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="unit_price" label-for="unit_price">
            <b-form-input v-model="formData.unit_price" name="unit_price" type="number" placeholder="unit_price" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="size" label-for="size">
            <b-form-input v-model="formData.size" name="size" placeholder="size" />
          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label="type" label-for="type">
            <v-select id="type" v-model="formData.type" label="type" :options="types_products" />
          </b-form-group>
        </b-col>

        <b-col sm="12">
          <b-form-group label="description" label-for="description">
            <b-form-textarea id="description" v-model="formData.description" rows="4"
              placeholder="Your description product here..." />

          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mt-2 mr-1" type="submit">
            Save changes
          </b-button>
          <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" variant="outline-secondary" type="reset" class="mt-2"
            @click.prevent="resetForm">
            Reset
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ProductService from '@/services/ProductService'
// eslint-disable-next-line import/extensions
import { BASE_URL } from '@/config.js' // Adjust the path if necessary

import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BFormTextarea, BRow, BCol, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
import vSelect from 'vue-select'

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    vSelect,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      formData: {
        name: '',
        unit_price: null,
        description: '',
        size: '',
        type: '',
        // image: '',
        imagePreview: 'https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg',
      },
      image: null,
      types_products: [ // Define your array of items here
        'Electronics', 'Clothing', 'Books', 'Furniture', 'Others',
      ],
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    productId() {
      // Assuming you pass the product ID as a prop
      return this.$route.params.id
    },
  },
  async mounted() {
    // Fetch product data if productId exists
    if (this.productId) {
      try {
        const product = await ProductService.getProduct(this.productId)
        // Update formData with product data
        this.formData = product
        this.formData.imagePreview = product.image ? `${BASE_URL}storage/products/${product.image}` : 'https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg'// Construct the complete URL
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    // Reset the form data when switching routes
    this.resetForm()
    next()
  },
  methods: {
    resetForm() {
      this.formData = {
        name: '',
        unit_price: null,
        description: '',
        size: '',
        type: '',
        imagePreview: 'https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg',
      }
      this.image = null
    },
    async handleSubmit() {
      try {
        if (this.productId) {
          await this.updateProduct()
        } else {
          await this.createProduct()
        }
        // Optionally, you can redirect the user after successful submission
        this.$router.push('/')
      } catch (error) {
        console.error('Error:', error.message)
      }
    },
    async createProduct() {
      try {
        await ProductService.createProduct(this.formData, this.image)
        console.log('Product created successfully')
      } catch (error) {
        throw new Error('Error creating product')
      }
    },
    async updateProduct() {
      try {
        await ProductService.updateProduct(this.productId, this.formData, this.image)
        console.log('Product updated successfully')
      } catch (error) {
        throw new Error('Error updating product')
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]

      // Set the image preview URL
      this.formData.imagePreview = URL.createObjectURL(file)

      // Set the image file in formData
      this.image = file
    },

  },
  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>

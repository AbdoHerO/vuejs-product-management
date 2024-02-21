<!-- eslint-disable vue/valid-template-root -->
<template>
  <div
    class="bg-white p-2"
    style="border-radius: 10px"
  >

    <b-row class="mb-3">
      <b-col
        md="10"
        xl="10"
        class="mb-1"
      >

        <!-- basic -->
        <b-form-group
          label="search"
          label-for="searchProduct"
        >
          <b-form-input
            id="searchProduct"
            placeholder="Search by: name, price, size, description, ..."
          />
        </b-form-group>
      </b-col>

      <b-col
        md="2"
        xl="2"
        class="d-flex justify-content-center align-items-center"
      >
        <!-- input text with help -->
        <b-form-group>
          <b-button
            variant="info"
            class="mr-2"
            @click="searchProducts()"
          >
            Search
          </b-button>
        </b-form-group>
      </b-col>
    </b-row>

    <b-card-body>
      <div class="d-flex justify-content-between  flex-wrap mb-2">

        <!-- sorting  -->
        <b-form-group
          label="Sort"
          label-size="sm"
          label-align-sm="left"
          label-cols-sm="2"
          label-for="sortBySelect"
          class="mr-1 mb-md-0"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sortBySelect"
              v-model="sortBy"
              :options="sortOptions"
            >
              <template #first>
                <option value="">
                  none
                </option>
              </template>
            </b-form-select>
            <b-form-select
              v-model="sortDesc"
              size="sm"
              :disabled="!sortBy"
            >
              <option :value="false">
                Asc
              </option>
              <option :value="true">
                Desc
              </option>
            </b-form-select>
          </b-input-group>
        </b-form-group>

        <!-- filter -->
        <b-form-group
          label="Filter"
          label-cols-sm="2"
          label-align-sm="left"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            />
            <b-input-group-append>
              <b-button
                :disabled="!filter"
                @click="filter = ''"
              >
                Clear
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </div>
    </b-card-body>

    <b-table
      striped
      hover
      responsive
      class="position-relative"
      :per-page="perPage"
      :current-page="currentPage"
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :filter="filter"
      :filter-included-fields="filterOn"
      @filtered="onFiltered"
    >
      <template #cell(image)="data">
        <b-avatar :src="data.value" />
      </template>

      <!-- Action cell template -->
      <template #cell(actions)="data">
        <b-button
          variant="warning"
          class="mr-2"
          @click="editItem(data.item)"
        >
          Edit
        </b-button>
        <b-button
          variant="danger"
          @click="deleteItem(data.item)"
        >
          Delete
        </b-button>
      </template>
    </b-table>

    <b-card-body class="d-flex justify-content-between flex-wrap pt-0">

      <!-- page length -->
      <b-form-group
        label="Per Page"
        label-cols="6"
        label-align="left"
        label-size="sm"
        label-for="sortBySelect"
        class="text-nowrap mb-md-0 mr-1"
      >
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          size="sm"
          inline
          :options="pageOptions"
        />
      </b-form-group>

      <!-- pagination -->
      <div>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          first-number
          last-number
          prev-class="prev-item"
          next-class="next-item"
          class="mb-0"
        >
          <template #prev-text>
            <feather-icon
              icon="ChevronLeftIcon"
              size="18"
            />
          </template>
          <template #next-text>
            <feather-icon
              icon="ChevronRightIcon"
              size="18"
            />
          </template>
        </b-pagination>
      </div>
    </b-card-body>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import ProductService from '@/services/ProductService'
// eslint-disable-next-line import/extensions
import { BASE_URL } from '@/config.js' // Adjust the path if necessary

import {
  BTable, BAvatar, BFormGroup, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton,
  BRow, BCol, BCard, BCardHeader, BCardTitle, BCardBody, BCardText,
} from 'bootstrap-vue'
// import { router } from '@/router' // Assuming you have router instance exported from your router file

export default {
  components: {
    BTable,
    BAvatar,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BRow,
    BCol,
    // eslint-disable-next-line vue/no-unused-components
    BCardText,
    // eslint-disable-next-line vue/no-unused-components
    BCard,
    // eslint-disable-next-line vue/no-unused-components
    BCardHeader,
    // eslint-disable-next-line vue/no-unused-components
    BCardTitle,
    BCardBody,
  },
  data() {
    return {
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      fields: [
        {
          key: 'id', label: 'Id',
        },
        {
          key: 'image', label: 'Avatar',
        },
        { key: 'name', label: 'Product Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        'unit_price',
        'size',
        {
          key: 'actions',
          label: 'Actions',
          class: 'text-center',
        },
      ],
      /* eslint-disable global-require */
      items: [
      ],
      /* eslint-disable global-require */
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }))
    },
  },
  async mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
    try {
      const products = await ProductService.getProducts()
      // Update formData with product data
      this.items = products.map(product => ({
        ...product,
        size: product.size ? product.size : '-',
        type: product.type ? product.type : '-',
        image: product.image ? `${BASE_URL}storage/products/${product.image}` : 'https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg',
      }))
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    editItem(item) {
      // Redirect to the edit route with the item's ID
      this.$router.push(`/products/${item.id}/edit`)
      // router.push(`/products/${item.id}/edit`)
    },
    async deleteItem(item) {
      try {
        // Call the ProductService method to delete the item
        await ProductService.deleteProduct(item.id)
        // If the deletion is successful, remove the item from the table
        const index = this.items.indexOf(item)
        if (index !== -1) {
          this.items.splice(index, 1)
          // Update the totalRows count after deletion
          this.totalRows = this.items.length
        }
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    },
    async searchProducts() {
      try {
        const searchInput = document.getElementById('searchProduct').value // Get the value from the search input
        const products = await ProductService.searchForProduct(searchInput) // Call the ProductService method to search for products
        this.items = products.map(product => ({
          ...product,
          image: product.image ? `${BASE_URL}storage/products/${product.image}` : 'https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg',
        }))
        this.totalRows = this.items.length // Update the totalRows count after fetching the search results
      } catch (error) {
        console.error('Error searching products:', error)
      }
    },
  },
}
</script>

var eventBus = new Vue()

Vue.component('product-review', {
	template: `
		<form class="review-form" @submit.prevent="onSubmit">
			<p v-if='errors.length'>
				<b>Please correct the following:</b>
				<ul>
					<li v-for='error in errors'>{{ error }}</li>
				</ul>
			</p>
			<p>
				<label for="name">Name:</label>
				<input id="name" v-model="name" placeholder="name">
			</p>
			<p>
				<label for="review">Review:</label>
				<textarea id="review" v-model="review"></textarea>
			</p>
			<p>
				<label for="rating">Rating:</label>
				<select id="rating" v-model.number="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</p>
			<label for="recommend">Do you recommend this product?</label>
			<div>
				<input v-model="recommend" type='radio' id='yes' name='recommend' :value='true'>
				<label for='yes'>Yes</label>
				<input v-model.boolean="recommend" type='radio' id='no' name='recommend' :value='false'>
				<label for='no'>No</label>
			</div>
			<p>
				<input type="submit" value="Submit">
			</p>
		</form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			recommend: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			this.errors = []
			if (this.name && this.review && this.rating && this.recommend !== null) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
					recommend: this.recommend
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
				this.recommend = null
			} else {
				if(!this.name) this.errors.push("Name required")
				if(!this.review) this.errors.push("Review required")
				if(!this.rating) this.errors.push("Rating required")
				if(this.recommend == null) this.errors.push("Recommended required")
			}
		}
	}
})

Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	template: `
		<ul>
			<li v-for='detail in details'>{{ detail }}</li>
		</ul>
	`
})

Vue.component('tabs-component', {
	props: {
		tabs: {
			type: Array, // [{ tabName: 'Reviews', tabComponent: 'review-component' },
			required: true
		}
	},
	data() {
		return {
			selectedTabIdx: 0
		}
	},
	computed: {
		selectedTab() {
			return this.tabs[this.selectedTabIdx]
		}
	},
	template: `
		<div>
			<span class='tab'
				:class='{ activeTab: selectedTab === tab }'
				v-for="(tab, index) in tabs"
				:key='index'
				@click='selectedTab = tab'>
				{{ tab }}
			</span>
			<div v-show="selectedTab === 'Reviews'">
				<h2>Reviews</h2>
				<p v-if='!reviews.length'>There are no reviews yet</p>
				<ul>
					<li v-for='review in reviews'>
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
						<p>{{ review.recommend }}</p>
					</li>
				</ul>
			</div>
			<product-review v-show="selectedTab === 'Write a review'"></product-review>
		</div>
	`,
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			tabs: ['Reviews', 'Write a review'],
			selectedTab: 'Reviews'
		}
	},
	template: `
		<div>
			<span class='tab'
				:class='{ activeTab: selectedTab === tab }'
				v-for="(tab, index) in tabs"
				:key='index'
				@click='selectedTab = tab'>
				{{ tab }}
			</span>
			<div v-show="selectedTab === 'Reviews'">
				<h2>Reviews</h2>
				<p v-if='!reviews.length'>There are no reviews yet</p>
				<ul>
					<li v-for='review in reviews'>
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
						<p>{{ review.recommend }}</p>
					</li>
				</ul>
			</div>
			<product-review v-show="selectedTab === 'Write a review'"></product-review>
		</div>
	`,
})

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: false,
			default: false
		},
		cart: {
			type: Array,
			required: true
		}
	},
	template: `
		<div class='product'>
			<div class='product-image'>
				<img :src='image'>
			</div>
			<div class='product-info'>
				<h1 :class='{ striked: inventory <= 0 }'>{{ title }}</h1>
				<a :href='link'><p>{{ description }}</p></a>
				<p v-if='inStock'>In stock</p>
				<p v-else>Out of stock</p>
				<span v-if='onSale'>ON SALE!</span>
				<span>User is premium: {{ premium }}</span>
				<span>Shipping: {{ shipping }}</span>
				<product-details :details='details'></product-details>
				Sizes:
				<ul>
					<li v-for='size in sizes'>Size {{ size }}</li>
				</ul>
				<div v-for='(variant, index) in variants'
				:key='variant.variantId'
				@mouseover='updateProduct(index)'
				class='color-box'
				:style='variant.styleObject'>
				</div>
				<button @click='addToCart'
				:disabled='!inStock'
				:class='{ disabledButton: !inStock }'>Add to cart</button>
				<button @click='removeFromCart'
				:disabled='!isInCart'
				:class='{ disabledButton: !isInCart }'>Remove from cart</button>
			</div>
			<product-tabs :reviews='reviews'></product-tabs>
		</div>
	`,
	data() {
		return {
			brand: 'Vue',
			product: "Boots",
			description: "They are great!",
			selectedVariant: 0,
			link: 'http://www.google.com',
			inventory: 3,
			details: ['90% cotton', 'vegan', 'awesome'],
			variants: [{
				variantId: 123,
				styleObject: {
					backgroundColor: 'blue',
					border: '1px solid red'
				},
				brand: 'Generic',
				variantColor: 'blue',
				variantQuantity: 0,
				variantImage: 'https://cdn.shopify.com/s/files/1/1278/9255/products/SM-VANNUCCI-V1126RB.jpg?v=1484940185'
			},{
				variantId: 124,
				styleObject: {
					backgroundColor: 'green',
					border: '1px solid red'
				},
				brand: 'Vue',
				variantColor: 'green',
				variantQuantity: 11,
				variantImage: 'https://d2mxuefqeaa7sj.cloudfront.net/s_ACF2B3FED5F7644A8E27E3FE8A9142BB95ECC3C792EA9166BF492FA2116B5277_1517608730821_Screen+Shot+2018-02-02+at+4.58.29+PM.png'
			}],
			sizes: [1,2,3,4,5,6,7,8],
			reviews: []
		}
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart', { id: this.currentItem.variantId } )
		},
		removeFromCart() {
			this.$emit('remove-from-cart', { id: this.currentItem.variantId } )
		},
		updateProduct(index) {
			this.selectedVariant = index
		}
	},
	computed: {
		title() {
			return `${this.brand} ${this.product}`
		},
		image() {
			return this.currentItem.variantImage
		},
		inStock() {
			return this.currentItem.variantQuantity >= 1
		},
		onSale() {
			return this.currentItem.variantQuantity >= 10
		},
		isInCart() {
			return this.cart.some((itemId) => itemId == this.currentItem.variantId)
		},
		currentItem() {
			return this.variants[this.selectedVariant]
		},
		shipping() {
			if(this.premium) {
				return 'free'
			}
			return '$2.99'
		}
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview)
		})
	}
})

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart:[],
	},
	methods: {
		updateCart({ id }) {
			this.cart.push(id)
		},
		removeFromCart({ id }) {
			let deleteIdx = this.cart.findIndex((itemId) => itemId != id)
			this.cart.splice(deleteIdx, 1)
		}
	}
})

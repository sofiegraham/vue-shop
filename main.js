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
			errors: []
		}
	},
	methods: {
		onSubmit() {
			this.errors = []
			if (this.name && this.review && this.rating) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating
				}
				this.$emit('review-submitted', productReview)
				this.name = null,
				this.review = null,
				this.rating = null
			} else {
				if(!this.name) this.errors.push("Name required")
				if(!this.review) this.errors.push("Review required")
				if(!this.rating) this.errors.push("Rating required")
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
				<!-- <p v-else-if='inventory <= 10 && inventory > 0'>Running low</p> -->
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
			<div>
				<h2>Reviews</h2>
				<p v-if='!reviews.length'>There are no reviews yet</p>
				<ul>
					<li v-for='review in reviews'>
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
					</li>
				</ul>
			</div>
			<product-review @review-submitted='addReview'></product-review>
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
		},
		addReview(productReview) {
			this.reviews.push(productReview)
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
			console.log(this.selectedVariant)
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

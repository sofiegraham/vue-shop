Vue.component('details', {
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
				<details :details='details'></details>
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
				<button @click='removeFromCart'>Remove from cart</button>
				<div class='cart'>
					<p>Cart({{ cart }})</p>
				</div>
			</div>
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
			cart:0,
		}
	},
	methods: {
		addToCart() {
			this.cart += 1
		},
		removeFromCart() {
			this.cart -= 1
		},
		updateProduct(index) {
			this.selectedVariant = index
		},
	},
	computed: {
		title() {
			return `${this.brand} ${this.product}`
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			console.log(this.selectedVariant)
			return this.variants[this.selectedVariant].variantQuantity >= 1
		},
		onSale() {
			return this.variants[this.selectedVariant].variantQuantity >= 10
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
		premium: true
	}
})

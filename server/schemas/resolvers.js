const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params).populate('category');
    },
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    // create a checkout method for working with Stripe
    // checkout() query expects an array of product IDs. We'll pass this array into a new instance of an Order Mongoose model
    checkout: async (parent, args, context) => {
      // parse out the referring URL for the session to direct to upon success and cancel
      // GraphQL resolvers don't have access to header information. 
      // The ApolloServer, however, can be configured to provide a context. 
      // One use for context is to preserve the headers from the original request, which the Shop-Shop app already does for you
      // this will give us the base domain that the request came from
      // i.e. http://localhost:3001 when run locally
      const url = new URL(context.headers.referer).origin;
      // Order mongoose model receives the product ID array
      const order = new Order({ products: args.products });
      // define variable to convert these IDs into fully populated product objects
      const { products } = await order.populate('products').execPopulate();

      // define variable for new array that will hold the price IDs from stripe
      const line_items = [];

      // loop over the products from the Order model and pushes price ID for each one into a new line_items array
      for (let i = 0; i < products.length; i++) {
        // stripe process, step 1:
        // generate product id
        // include the description and product image for each product 
        // so they will be displayed in the Stripe checkout page
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`]
        });
        // stripe process, step 2:
        // generate price id using the product id
        const price = await stripe.prices.create({
          product: product.id,
          // stripe stores prices in cents, not dollars, so we need to multiple by 100
          unit_amount: products[i].price * 100,
          currency: 'usd',
        });
        // add price id to the line items array
        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      // stripe process, step 3:
      // generate a stripe checkout session using the array of price ID's
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        // use url variable that is parsed out from headers
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}`
      });

      // return the checkout session ID, which is the only data the resolver needs
      return { session: session.id };

    }

  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;

import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";

// Home page component manages the state currentCategory
// const Home = () => {
//   // manage state
//   const [currentCategory, setCategory] = useState("");

//   return (
//     <div className="container">
//       {/* state is set by Categories.  setCategory callback function is passed to CategoryMenu component as a prop to be executed */}
//       <CategoryMenu setCategory={setCategory} />
//       {/* state is passed to ProductList as a prop */}
//       <ProductList currentCategory={currentCategory} />
//     </div>
//   );
// };

// global state version
// component just needs to manage the display of other components
// rather than managing states
const Home = () => {
  return (
    <div className="container">
      <CategoryMenu />
      <ProductList />
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@material-ui/core";

const RecipeForm = () => {
  const [dish, setDish] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Dish:', dish);
    const response = await axios.post("https://cuisine-pal.up.railway.app/api/recipe", { dish });
    // const response = await axios.post("http://localhost:5000/api/recipe", { dish });
    setRecipe(response.data.recipe);
    setImage(response.data.imgLink); //setting image to the url from google search
    setLoading(false);
  };

  const formatRecipe = (recipe) => {
    const lines = recipe.split("\n");
    return lines.map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className="Form-container">
      <form onSubmit={handleSubmit}>
        <TextField
          id="dish"
          label="Dish"
          value={dish}
          onChange={(event) => setDish(event.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!dish}
        >
          Submit
        </Button>
      </form>
      {!loading && !recipe && dish === "" && <p>Please enter a dish to get recipe</p>}
       <div style={{ display: "flex", alignItems: "center" }}>
        {loading && <CircularProgress />}
        {loading && <p style={{ marginLeft: "10px", fontStyle: "italic" }}>Our chefs are working their magic...</p>}
      </div>
      {!loading && image && !recipe.includes("Please give a valid dish") && <img src={image} alt="dish" className="Dish-image" />}
      {/* {!loading && image && <img src={image} alt="dish" className="Dish-image" />} */}
      {!loading && recipe && <p className="recipeDisplay"> {formatRecipe(recipe)} </p>}
    </div>
  );
};

export default RecipeForm;

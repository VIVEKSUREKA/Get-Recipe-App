import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@material-ui/core";

const RecipeForm = () => {
  const [dish, setDish] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Dish:', dish);
    const response = await axios.post("http://localhost:5000/api/recipe", { dish });
    setRecipe(response.data.recipe);
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
      {loading && <CircularProgress />}
      {!loading && !recipe && dish === "" && <p>Please enter a dish to get recipe</p>}
      {!loading && recipe && formatRecipe(recipe)}
    </div>
  );
};

export default RecipeForm;

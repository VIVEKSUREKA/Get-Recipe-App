import axios from 'axios';
import dotenv from 'dotenv';
import dishrecipe from '../modal/model.js';
dotenv.config();

// function to call google custom search api
const search = async (query) => {
  const config = {
    method: 'get',
    url: `https://customsearch.googleapis.com/customsearch/v1?cx=b4233c0ed513d408c&gl=in&num=1&q=${query}&safe=high&searchType=image&imgSize=MEDIUM&key=${process.env.GCSE_API_KEY}`,
    headers: { }
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data),"[response from Google Search axios call]"); 
    const imgLink = response.data.items[0].link;
    return imgLink;
  } catch (error) {
    console.log(error);
  }
}

const handleRoute = async (req, res) => {
    const apiKeyGPT = process.env.OPENAI_API_KEY;
    const { dish } = req.body;
    const prompt = `Please provide a recipe for ${dish}`;
    console.log(prompt);

    const data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
        {
            "role": "system",
            "content": "You work as a chef in India. You are giving food recipe to users. Be creative. Introduce the dish before giving recipe"
        },
        {
            "role": "user",
            "content": prompt
        }
        ]
    });

    const GPTconfig = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: { 
        'Authorization': `Bearer ${apiKeyGPT}`, 
        'Content-Type': 'application/json'
        },
        data : data
    };
    

    try {

        const existingRecipe = await dishrecipe.findOne({dish: `Please provide a recipe for ${dish}`});

        if(existingRecipe === null){ // recipe not found in db

            const [response, imgLink] = await Promise.all([axios(GPTconfig), search(dish)]);
            const recipe = response.data.choices[0].message.content;
            const recipeForDb = await dishrecipe.create({
                dish : prompt,
                recipe,
                imgLink,
            });
            console.log(JSON.stringify(response.data),"[response from GPT axios call]");                
            console.log({recipeForDb},"[saved to mongodb]");

            res.json({recipe, imgLink});
        
        }else{

            console.log({existingRecipe}, "[existing recipe from mongodb]");
            res.json({recipe: existingRecipe.recipe, imgLink: existingRecipe.imgLink});

        }

    } catch (e) {

        console.log({error: e.message},"[error in try catch] ");
        res.json({recipe: "Something went wrong", imgLink: ""});
    }
}

export default handleRoute;

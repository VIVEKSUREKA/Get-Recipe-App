import axios from 'axios';
import dotenv from 'dotenv';
import dishrecipe from '../modal/model.js';
dotenv.config();

const handleRoute = async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const { dish } = req.body;
    const prompt = `Please provide a recipe for ${dish}`;
    console.log(prompt);

    const data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
        {
            "role": "user",
            "content": prompt
        }
        ]
    });

    const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: { 
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json'
        },
        data : data
    };
    
    

    try {

        const existingRecipe = await dishrecipe.findOne({dish: `Please provide a recipe for ${dish}`});

        if(existingRecipe === null){ // recipe not found

            const response = await axios(config);
            const recipe = response.data.choices[0].message.content;
            const recipeForDb = await dishrecipe.create({
                dish : prompt,
                recipe,
            });
            console.log(JSON.stringify(response.data),"[response from axios call]");                
            console.log({recipeForDb},"[saved to mongodb]");

            res.json({recipe});
        
        }else{

            console.log({existingRecipe}, "[existing recipe from mongodb]");
            res.json({recipe: existingRecipe.recipe});

        }

    } catch (e) {

        console.log({error: e.message},"[error in try catch] ");
        res.json("Something went wrong");
    }
    
    
    /*dishrecipe.findOne({dish: `Please provide a recipe for ${dish}`})
    .then(function (response){

        if(response !== null){
            console.log({response},"[found the recipe]");
            res.json({recipe: response.recipe});
            return ;
        }else {
            axios(config)
            .then(function (response) {
                const recipe = response.data.choices[0].message.content;
                const result =  dishrecipe.create({
                    dish : prompt,
                    recipe,
                    createdAt: new Date(),
                });

                console.log(JSON.stringify(response.data));
                res.json({recipe});
                return result;
            })
            .then(function (result){
                console.log({result},"[mongo db result]");
            }).catch(function (e){
                console.log({error: e.message} , "[ error in axios function]");
                return e;
            })
        }
        
    })
    .catch(function (error) {
        console.log(error,"[error in api]");
    });*/

};

export default handleRoute;
import {useIngredients} from "../hooks/useIngedients.js";

export function Ingredients(){
    const {ingredients, error, loading} = useIngredients();
    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {ingredients.length > 0 && <p>Fetched {ingredients.length} ingredients</p> && (
                <ul>
                    {ingredients.map(ingredient => (
                        <li key={ingredient._id}>
                            <h3>{ingredient.name}</h3>
                            <p>{ingredient.description}</p>
                        </li>
                    ))}
                </ul>
            )}

        </>
    )
}

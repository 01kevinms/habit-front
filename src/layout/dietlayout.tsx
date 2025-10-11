import { useState } from "react";
import { searchfoodapi } from "../services/api";
import { useDiets } from "../hooks/useDiet";
import type { Diet, NutritionixFood } from "../types/manytypes";

function DietLayout({ diets }: { diets: Diet[] }) {
  const { addNewFoodToDiet } = useDiets();
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [gramsInput, setGramsInput] = useState<Record<string, number>>({});
  const [selectedDietId, setSelectedDietId] = useState<Record<string, string>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const result = await searchfoodapi(query);
    setFoods(result);
  }

 const handleAddFood = (food: NutritionixFood) => {
  const dietId = selectedDietId[food.food_name];
  if (!dietId) return alert("Selecione uma dieta!");

  const grams = gramsInput[food.food_name] ?? food.serving_qty;

  addNewFoodToDiet.mutate({
    dietId,
    food: {
      description: food.food_name,
      grams,
      calories: food.nf_calories,
      protein: food.nf_protein,
      carbs: food.nf_total_carbohydrate,
    },
  });
};


  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full">
      <h2 className="text-xl dark:text-gray-50 font-semibold">Buscar alimentos</h2>

      <form onSubmit={handleSearch} className="space-y-3 flex gap-2 md:flex-col">
        <input
          type="text"
          placeholder="Nome do alimento"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        />
        <button type="submit" className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-600">
          Buscar
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {foods.length > 0 ? foods.map((food, index) => (
          <div key={index} className="p-3 border rounded bg-gray-100 dark:bg-gray-700">
            <p className="font-semibold text-xl py-1">{food.food_name}</p>
            <p>Baseado em: {food.serving_weight_grams}g</p>
            <p>Calorias: {food.nf_calories} kcal</p>
            <p>Carboidratos: {food.nf_total_carbohydrate} g</p>
            <p>Proteínas: {food.nf_protein} g</p>
            <img
              src={food.photo.thumb}
              style={{ width: 70, height: 70, objectFit: "cover" }}
            />

            <input
              type="number"
              placeholder="Gramas"
              value={gramsInput[food.food_name] ?? ""}
              onChange={(e) => setGramsInput(prev => ({ ...prev, [food.food_name]: Number(e.target.value) }))}
              className="mt-2 border rounded px-2 py-1 w-24 dark:bg-gray-600"
            />

            <select
              className="mt-2 border rounded px-2 py-1 dark:bg-gray-600 w-full"
              value={selectedDietId[food.food_name] ?? ""}
              onChange={(e) => setSelectedDietId(prev => ({ ...prev, [food.food_name]: e.target.value }))}
            >
              <option className="w-auto" value="">Escolha a dieta</option>
              {diets.map(d => <option key={d.id} value={d.id}>{d.description} ({d.period})</option>)}
            </select>

            <button
              onClick={() => handleAddFood(food)}
              className="mt-2 ml-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Adicionar à dieta
            </button>
          </div>
        )) : query && <p className="text-gray-500">Nenhum alimento encontrado</p>}
      </div>
    </div>
  );
}

export default DietLayout;

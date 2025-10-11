import { useState } from "react";
import { Pencil, Check, Trash, X } from "lucide-react";
import { useDiets } from "../hooks/useDiet";
import type { Food, ListDietsProps } from "../types/manytypes";
import Tippy from '@tippyjs/react';

export function ListDiets({ diets, onDelete }: ListDietsProps) {
  const { updateFood, deleteFood } = useDiets();
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [grams, setGrams] = useState<number>(0);

  const handleSave = (food: Food, dietId: string) => {
    if (!food?.id) return;
    updateFood.mutate({ dietId: dietId, id: food.id, grams });
    setEditingFoodId(null);
  };
const handledeleteFood = (id: string, dietId: string)=>{
  if(!confirm("Tem certeza que deseja deletar este alimento?")) return;
  deleteFood.mutate({id, dietId});
}
  return (
    /* quando colocar responsividade colocar lucide-react
     Plus no description da dieta para abrir o buscar dietas */
    <div>
      {diets.map(diet => (
        <div key={diet.id} className="p-3 rounded mb-3 bg-gray-100 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-2 border-b">
            <p className="font-bold">{diet.description}</p>
            <p>Data: <span className="text-purple-400">{diet.datekey}</span></p>
            <p>Tipo de dieta: <span className="text-green-400">{diet.type}</span></p>
            <p>Período: <span className="text-blue-400">{diet.period}</span></p>
           <Tippy content="Excluir dieta">
            <button onClick={() => onDelete && onDelete(diet.id)} className="w-6 pb-1.5">
              <Trash className="w-5 h-5 text-red-500 hover:scale-120 cursor-pointer"/>
            </button>
           </Tippy>
          </div>

          <div className="grid grid-cols-6 gap-2 font-bold text-sm">
            <p>Alimento</p>
            <p>Gramas</p>
            <p>Calorias</p>
            <p>Proteínas</p>
            <p>Carboidratos</p>
          </div>

          {diet.foods?.map(f => (
            <div key={f.id} className="grid grid-cols-6 gap-2 py-1 items-center border-b border-gray-300">
              <p>{f.description}</p>

              <div className="flex items-center gap-1">
                {editingFoodId === f.id ? (
                  <>
                    <input
                      type="number"
                      value={grams}
                      onChange={e => setGrams(Number(e.target.value))}
                      className="w-16 border px-1 rounded"
                    />
                    <button onClick={() => handleSave(f, diet.id)}>
                      <Check className="w-4 h-4 text-green-500" />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{f.grams} g</span>
                    <button onClick={() => { setEditingFoodId(f.id); setGrams(f.grams); }}>
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <p>{f.calories.toFixed(1)} kcal</p>
              <p>{f.protein.toFixed(1)} g</p>
              <p>{f.carbs.toFixed(1)} g</p>
             
             <Tippy content="Excluir alimento da dieta" placement="right">
              <button onClick={()=> handledeleteFood(f.id, diet.id)}
               className="w-6"
                >
                  <X xlinkTitle="excluir alimento" className="hover:scale-125 text-red-400 cursor-pointer"/>
                </button>
                  </Tippy>
                 
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { Pencil, Check, Trash, X } from "lucide-react";
import { useDiets } from "../hooks/useDiet";
import type { Food, ListDietsProps } from "../types/manytypes";
import Tippy from '@tippyjs/react';

export function ListDiets({ diets, onDelete }: ListDietsProps) {
  const { updateFood, deleteFood, isLoading } = useDiets();
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
   <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full mx-auto">
   <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
    {isLoading  ? (
      <p>Carregando...</p>
    ) : diets.length === 0 ? (
      <p>Nenhuma dieta criada ainda.</p>
    ) : (
      <>
      {diets.map((diet) => (
        <div
        key={diet.id}
        className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-md w-full"
        >
      {/* ===== Cabeçalho ===== */}
      <div className="flex justify-between items-center mb-3 border-b pb-2 gap-2 xl:flex-nowrap content-between sm:flex-nowrap">
        <div className="xl:grid grid-cols-4 w-full">
          <p className="font-bold text-lg">{diet.description}</p>
          <p className="text-sm">
            Data: <span className="text-purple-400">{diet.datekey}</span>
          </p>
          <p className="text-sm">
            Tipo: <span className="text-green-400">{diet.type}</span>
          </p>
          <p className="text-sm">
            Período: <span className="text-blue-400">{diet.period}</span>
          </p>
        </div>

        <Tippy content="Excluir dieta">
          <button
            onClick={() => onDelete && onDelete(diet.id)}
            className="w-6 pb-1.5"
            >
            <Trash className="w-5 h-5 text-red-500 hover:scale-125 transition-transform cursor-pointer" />
          </button>
        </Tippy>
      </div>

      {/* ===== Cabeçalho da tabela ===== */}
     <div className="hidden md:grid md:grid-cols-6 gap-2 font-bold text-sm border-b border-gray-400 pb-1">
        <p>Alimento</p>
        <p>Gramas</p>
        <p>Calorias</p>
        <p>Proteínas</p>
        <p>Carboidratos</p>
      </div>

      {/* ===== Lista de alimentos ===== */}
      <div>
        {diet.foods?.map((f) => (
          <div
          key={f.id}
          className="grid grid-cols-1 md:grid-cols-6 gap-2 py-2 items-center"
          >
            <div className="gap-2 inline-flex"><span className="md:hidden">Alimentos:</span>
            <p className="truncate grid grid-cols-2">{f.description}</p>
            </div>

            {/* Edição dos gramas */}
            <div className="flex items-center gap-1">
              {editingFoodId === f.id ? (
                <>
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(Number(e.target.value))}
                    className="w-16 border px-1 rounded"
                    />
                  <button onClick={() => handleSave(f, diet.id)}>
                    <Check className="w-4 h-4 text-green-500" />
                  </button>
                </>
              ) : (
                <>
                  <div className="gap-2 inline-flex"><span className="md:hidden">Gramas:</span>
                    <span>{f.grams} g</span>
                    </div>
                  <button
                    onClick={() => {
                      setEditingFoodId(f.id);
                      setGrams(f.grams);
                    }}
                    >
                    <Pencil className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Colunas numéricas */}
            <div className="gap-2 inline-flex"><span className="md:hidden">Calorias:</span>
            <p >{f.calories.toFixed(1)} kcal</p>
            </div>
            <div className="gap-2 inline-flex"><span className="md:hidden">Proteinas:</span>
            <p >{f.protein.toFixed(1)}g</p>
            </div>
            <div className="gap-2 inline-flex"><span className="md:hidden">Carboidratos</span>
            <p >{f.carbs.toFixed(1)} g</p>
            </div>

            {/* Botão de exclusão (visível em todas telas) */}
            <div className="flex justify-end sm:justify-center">
              <Tippy content="Excluir alimento da dieta" placement="left">
                <button
                  onClick={() => handledeleteFood(f.id, diet.id)}
                  className="w-6"
                  >
                  <X className="hover:scale-135 text-red-400 cursor-pointer transition-transform" />
                </button>
              </Tippy>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
     </>
)}
</div>
</div>
  );
}

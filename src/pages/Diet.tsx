import { useState } from "react";
import { useDiets } from "../hooks/useDiet";
import type { Diet, DietType, NewDiet } from "../types/manytypes";
import DietLayout from "../layout/dietlayout";
import {ListDiets}  from "../layout/listdiet";

export default function Diets() {
  const { data, isLoading, createDiet,updateDiet } = useDiets();
const diets = data?.diets ?? [];
const totalCalories = data?.totalCalories ?? 0;
const meta = data?.meta ?? 0;
const atingiumeta = data?.atingiumeta ?? false;

  const [type, setType] = useState<DietType>("bulking");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState<"Manhã" | "meio-dia" | "noite">("Manhã");
  const [datekey, setDatekey] = useState<string>(new Date().toISOString().slice(0, 10));
  const { deleteDiet } = useDiets();

function handleEditDiet(diet: Diet) {
  
  updateDiet.mutate({id: diet.id, diet},
    {onSuccess:()=>{alert("Alimento adicionado à dieta!")}}
  )
}

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description) {
      alert("Preencha todos os campos antes de criar a dieta.");
      return;
    }

const newDiet: NewDiet = {
  type,
  description,
  period,
  datekey,
};
    createDiet.mutate(newDiet);

    setDescription("");
  }
  

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <div className="grid grid-cols-3 gap-10">
            
        {/* ===== Formulário ===== */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full">
          <h2 className="text-xl font-bold mb-4">Criar dieta</h2>
          <form onSubmit={handleSubmit} className="space-y-3">

            <label htmlFor="descricao">Nome da reifeição</label>
            <input
            id="descricao"
              type="text"
              placeholder="Ex: café da manhã"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />      
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="string"
              placeholder="data"
              value={datekey}
              onChange={(e) => setDatekey(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />

            <label htmlFor="typ">Tipo de dieta</label>
            <select
              id="typ"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="bulking">Bulking</option>
              <option value="cutting">Cutting</option>
            </select>

            <label htmlFor="periodo">Período</label>
            <select
              id="periodo"
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="Manhã">Manhã</option>
              <option value="meio-dia">Meio-dia</option>
              <option value="noite">Noite</option>
            </select>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Criar
            </button>
          </form>
        </div>

           {/*burcar alimentos via api  */}

              <DietLayout diets={diets}/>
            
        {/* ===== Resumo Diário ===== */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full h-[40%] ">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <div>
              <p className="font-semibold">Total de calorias: {totalCalories}</p>
              <p>Meta diária: {meta}</p>
              <p>
                Status:{" "}
                {atingiumeta ? (
                  <span className="text-green-500">Meta atingida ✅</span>
                ) : (
                  <span className="text-red-500">Ainda não atingida ❌</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Listagem de Dietas ===== */}

        <ListDiets onDelete={(id)=>deleteDiet.mutate(id)} diets={diets} onEdit={handleEditDiet}  />

    </div>
  );
}

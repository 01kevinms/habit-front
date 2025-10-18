import { useState, useEffect } from "react";
import type { GenereType, NewStatus, Status } from "../types/manytypes";
import { useStatusPhysical, useWaterProgress } from "../hooks/useStatus";
import { Trash } from "lucide-react";
import Tippy from "@tippyjs/react";
import { useAuth } from "../services/AuthContext";

export function StatusPhisical() {
  const { token } = useAuth();
  const { status, isLoading, createStatush, deleteStatus } = useStatusPhysical();
  const { today } = useWaterProgress(token!);

  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [genere, setGenere] = useState<GenereType>("masculine");

  const [imc, setImc] = useState(0);
  const [tmb, setTmb] = useState(0);

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const ageNum = parseInt(age);

  // Calcula IMC sempre que peso ou altura mudam
  useEffect(() => {
    if (weight && height) {
      setImc(weightNum / (heightNum * heightNum));
    }
  }, [weight, height]);

  // Calcula TMB sempre que peso, altura, idade ou gênero mudam
  useEffect(() => {
    if (weight && height && age) {
      if (genere === "masculine") {
        setTmb(66.5 + 13.75 * weightNum + 5.003 * (heightNum * 100) - 6.775 * ageNum);
      } else {
        setTmb(655.1 + 9.563 * weightNum + 1.85 * (heightNum * 100) - 4.676 * ageNum);
      }
    }
  }, [weight, height, age, genere]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weight || !height || !age) {
      return alert("Preencha peso, altura e idade antes de criar o status.");
    }

    const newStatus: NewStatus = {
      imc,
      weight: weightNum,
      height: heightNum,
      age: ageNum,
      genere,
      tmb,
      water: today?.goal ?? 0, // já pega a meta do dia
    };

    createStatush.mutate(newStatus);
    // Resetar campos
    setWeight("");
    setHeight("");
    setAge("");
    setGenere("masculine");
    setImc(0);
    setTmb(0);
  }

  function getIMCLabelAndColor(imc: number) {
    if (imc < 18.5) return { label: "Abaixo do peso", color: "text-red-300" };
    if (imc < 24.9) return { label: "Peso normal", color: "text-green-400" };
    if (imc < 29.9) return { label: "Sobrepeso", color: "text-yellow-400" };
    return { label: "Obesidade", color: "text-red-400" };
  }

  function colorGenere(genere: GenereType) {
    return genere === "masculine" ? "text-blue-400" : "text-pink-400";
  }

  return (
    <div className="flex flex-col gap-4 w-[80%] mx-auto items-center">
      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Seu IMC e TMB</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label>Peso (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />

          <label>Altura (m)</label>
          <input
            type="number"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />

          <label>Idade</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />

          <label>Gênero</label>
          <select
            value={genere}
            onChange={(e) => setGenere(e.target.value as GenereType)}
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="masculine">Masculino</option>
            <option value="feminine">Feminino</option>
          </select>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Criar
          </button>
        </form>
      </div>

      {/* Lista de status */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Meus status</h2>
        {isLoading ? (
          <p>Carregando...</p>
        ) : status.length === 0 ? (
          <p>Nenhum status cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {status.map((statu: Status) => {
              const { label, color } = getIMCLabelAndColor(statu.imc);
              return (
                <li
                  key={statu.id}
                  className="flex justify-between items-end border-b border-gray-200 dark:border-gray-600 py-2 lg:items-center"
                >
                  <div className="inline-block lg:grid lg:grid-cols-8 lg:gap-6">
                    <p className="lg:grid">Idade: <span>{statu.age}</span></p>
                    <p className="lg:grid">Gênero: <span className={colorGenere(statu.genere)}>{statu.genere}</span></p>
                    <p className="lg:grid">Altura: <span>{statu.height.toFixed(2)}</span></p>
                    <p className="lg:grid">Peso: <span>{statu.weight} kg</span></p>
                    <p className="lg:grid">IMC: <span className={color}>{statu.imc.toFixed(1)}</span> <span className={color}>{label}</span></p>
                    <p className="lg:grid">TMB: <span>{statu.tmb.toFixed(0)} kcal</span></p>
                    <p className="lg:grid">Meta de água: <span className="text-blue-400">{today?.goal ?? 0} ml</span></p>                
                  </div>

                  <Tippy content="Excluir status" placement="top">
                    <button onClick={() => deleteStatus.mutate(statu.id)}>
                      <Trash className="w-6 h-6 text-red-500 hover:scale-125 cursor-pointer" />
                    </button>
                  </Tippy>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

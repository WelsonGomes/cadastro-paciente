import { useForm } from "react-hook-form"
import { z } from "zod";
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

const CadastroSchema = z.object({
    nome: z.string()
        .nonempty("O nome é obrigatório!"),
    sexo: z.string()
        .nonempty("O sexo é obrigatório!"),
    idade: z.string()
        .nonempty("O idade é obrigatório!"),
    cidade: z.string()
        .nonempty("O cidade é obrigatório!"),
});

type CadastroData = z.infer<typeof CadastroSchema>

export function Cadastro() {

    const { register, handleSubmit, formState: {errors}, setValue} = useForm<CadastroData>({
        resolver: zodResolver(CadastroSchema)
    })

    const navigate = useNavigate();

    const onSubmit = (d:CadastroData) => {
        try{
            localStorage.setItem(d.nome, JSON.stringify(d));
            const chaves = localStorage.getItem("keys") || "xxx";
            if (chaves !== 'xxx'){
                let keys = chaves;
                // alert("chaves="+keys);
                keys = keys + ',' + d.nome;
                // keys.push(d.nome);
                localStorage.setItem("keys", keys);
            }else{
                localStorage.setItem("keys", d.nome);
            }
            // const arrayChaves = localStorage.getItem('keys')?.split(",");

            // alert("array de chaves= " + arrayChaves);

            alert("cadastro realizado");
            setValue("nome","");
            setValue("sexo","");
            setValue("idade","");
            setValue("cidade","");
        }catch(errors) {
            alert(errors);
        }

    }

    const removeRegisters = () => {
        try{
            localStorage.clear();
            alert('Registros removidos com sucesso.');
        }catch(error){
            alert('Não foi possivel remover os registros. '+error)
        }

    }

    return(
        <div className="h-screen bg-slate-900 text-white flex text-center items-center justify-center flex-col">
            <form action="" onSubmit={handleSubmit(onSubmit)} className="border-solid border-2 border-l-indigo-300 px-10 rounded-2xl w-2/6 flex flex-col gap-5">

                <div >
                    <h1 className="text-2xl font-semibold mt-3">CADASTRO DE PACIENTE</h1>
                </div>

                <div className="flex flex-col text-left gap-1 mt-2">
                    <label htmlFor="nome">Nome</label>
                    <input {...register("nome")} className="rounded-sm h-8 text-black p-1" type="text"/>
                    { errors.nome && <span className="text-red-600">{errors.nome.message}</span> }
                </div>  

                <div className="flex flex-col text-left gap-1">
                    <label htmlFor="sexo">Sexo</label>
                    <select {...register("sexo")} className="rounded-sm h-8 text-black p-1">
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outros</option>
                    </select>
                    {/* <input  className="rounded-sm h-8 text-black p-1" type="text"/> */}
                    { errors.sexo && <span className="text-red-600">{errors.sexo.message}</span> }
                </div>  

                <div className="flex flex-col text-left gap-1">
                    <label htmlFor="idade">Idade</label>
                    <input {...register("idade")} className="rounded-sm h-8 text-black p-1" type="text"/>
                    { errors.idade && <span className="text-red-600">{errors.idade.message}</span> }
                </div>  

                <div className="flex flex-col text-left gap-1">
                    <label htmlFor="cidade">Cidade</label>
                    <input {...register("cidade")} className="rounded-sm h-8 text-black p-1" type="text"/>
                    { errors.cidade && <span className="text-red-600">{errors.cidade.message}</span> }
                </div>  

                <button className="bg-green-600 mt-2 rounded font-semibold text-white p-1 hover:bg-green-500 mb-5">Cadastrar</button>
            </form>

            <div className="flex justify-between content-between w-2/6 mt-3">

                <button 
                onClick={() => navigate("consultaPaciente")} 
                className="bg-orange-600 text-white rounded-md px-5 py-1"
                >Consultar Pacientes</button>

                <button 
                onClick={removeRegisters} 
                className="bg-red-600 text-white rounded-md px-5 py-1"
                >Limpar Pacientes</button>

            </div>

        </div>
    )
}

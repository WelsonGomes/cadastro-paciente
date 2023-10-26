import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "react-bootstrap";
import "../style/global.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserData {
    nome: string;
    idade: string;
    sexo: string;
    cidade: string;
    frequenciaCardiaca: number;
    pressaoArterial: string;
    temperatura: number;
    saturacaoOxigenio: number;
    frequenciaCardiacaalerta: boolean;
    frequenciaCardiacaemergencia: boolean;
    temperaturaalerta: boolean;
    temperaturaemergencia: boolean;
    saturacaoOxigenioalerta: boolean;
    saturacaoOxigenioemergencia: boolean;
    dataLeitura: Date;
    userHistory: UserData[];
};

export default function listaPacientes(){
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
    const { register, handleSubmit, formState: {errors}, setValue} = useForm<CadastroData>({
        resolver: zodResolver(CadastroSchema)
    });
    const [modalCadastro, setModalCadastro] = useState(false);
    let [user, setUser] = useState<UserData[] | null>()

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

    function Cadastrar(){
        return (
            <Modal show={modalCadastro} centered onHide={() => setModalCadastro(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar novo paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-white flex text-center justify-center flex-col">
                        <form action="" onSubmit={handleSubmit(onSubmit)} className="px-10 rounded-2xl flex flex-col gap-4 text-black">
                            <div className="flex flex-col text-left gap-1 mt-2">
                                <label htmlFor="nome">Nome</label>
                                <input {...register("nome")} className="border-solid border-1 border-black rounded-sm h-8 text-black p-1" type="text"/>
                                { errors.nome && <span className="text-red-600">{errors.nome.message}</span> }
                            </div>  

                            <div className="flex flex-col text-left gap-1">
                                <label htmlFor="sexo">Sexo</label>
                                <select {...register("sexo")} className="border-solid border-1 border-black rounded-sm h-8 text-black p-1">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="O">Outros</option>
                                </select>
                                {/* <input  className="rounded-sm h-8 text-black p-1" type="text"/> */}
                                { errors.sexo && <span className="text-red-600">{errors.sexo.message}</span> }
                            </div>  

                            <div className="flex flex-col text-left gap-1">
                                <label htmlFor="idade">Idade</label>
                                <input {...register("idade")} className="border-solid border-1 border-black rounded-sm h-8 text-black p-1" type="text"/>
                                { errors.idade && <span className="text-red-600">{errors.idade.message}</span> }
                            </div>  

                            <div className="flex flex-col text-left gap-1">
                                <label htmlFor="cidade">Cidade</label>
                                <input {...register("cidade")} className="border-solid border-1 border-black rounded-sm h-8 text-black p-1" type="text"/>
                                { errors.cidade && <span className="text-red-600">{errors.cidade.message}</span> }
                            </div>  

                            <button className="bg-green-600 mt-2 rounded font-semibold text-white p-1 hover:bg-green-500 mb-5">Cadastrar</button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    function consultaPessoas() {
        const keys = localStorage.getItem('keys');
        const arrayKeys = keys?.split(',') || [];
        let newUser : UserData[] = [];
        // let userHistory : UserData[] = [];

        arrayKeys.forEach(element => {
            //alert(user)
            let item = localStorage.getItem(element);
            
            //alert(item)
            if (item){
                const userData = JSON.parse(item) as UserData;
                userData.frequenciaCardiaca= Math.floor(Math.random() * 100 + 60),
                userData.pressaoArterial= `${Math.floor(Math.random() * 50 + 90)}/${Math.floor(Math.random() * 20 + 60)}`,
                userData.temperatura= Math.round(Math.random() * 2.5 + 36),
                userData.saturacaoOxigenio = Math.floor(Math.random() * 20 + 80),
                userData.dataLeitura= new Date();

                // Verifique se há um histórico de medições para este paciente
                const historyKey = `${userData.nome}_history`;
                let history: UserData[] = JSON.parse(localStorage.getItem(historyKey) || '[]');

                // Adicione a nova medição ao histórico
                history.push(userData);

                // Limite o histórico a 5 medições
                if (history.length > 5) {
                    history = history.slice(-5);
                }

                // Salve o histórico de medições
                localStorage.setItem(historyKey, JSON.stringify(history));

                //exibe cor de alerta caso...
                if (userData.idade <= "17") { // pessoas a baixo de 17 anos
                    // considerando pacientes em repouso frequencia max é de 100 acima disso esta elevado
                    userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 100;
                }else if (userData.idade <= "64"){ //pessoas a baixo de 64 anos
                    // considerado pacientes em repouso drequencia max é de 110 acima disso esta elevado
                    userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 110;
                }else{ //pessoas acima de 64 ano
                    // considerado pacientes em repouso drequencia max é de 90 acima disso esta elevado
                    userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 90;
                }

                //exibe cor de perigo caso...
                if (userData.idade <= "17") { // pessoas a baixo de 17 anos
                    userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 120;
                }else if (userData.idade <= "64"){ //pessoas a baixo de 64 anos
                    userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 130;
                }else{ //pessoas acima de 64 ano
                    userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 110;
                }

                if (userData.temperatura < 37){
                    userData.temperaturaalerta = false;
                    userData.temperaturaemergencia = false;
                }else if (userData.temperatura < 38){
                    userData.temperaturaalerta = true;
                    userData.temperaturaemergencia = false;
                }else{
                    userData.temperaturaalerta = true;
                    userData.temperaturaemergencia = true;
                }

                if (userData.saturacaoOxigenio < 85){
                    userData.saturacaoOxigenioalerta = true;
                    userData.saturacaoOxigenioemergencia = true;
                }else if (userData.saturacaoOxigenio < 95){
                    userData.saturacaoOxigenioalerta = true;
                    userData.saturacaoOxigenioemergencia = false;
                }else{
                    userData.saturacaoOxigenioalerta = false;
                    userData.saturacaoOxigenioemergencia = false;
                }
                // userHistory.push(history)
                userData.userHistory = history;
                newUser.push(userData) 
                // console.log(JSON.stringify(userData,null,2));
            }
        });
        // setUserHis(userHistory);
        setUser(newUser);
    }

    useEffect(() => {
        if (localStorage.getItem('keys') != null){
            const intervalId = setInterval(() => {
                consultaPessoas()
            }, 10000); // 10 segundos
            return () => clearInterval(intervalId);
        }

    }, []);

    return (
        <div>
            <Cadastrar />
            <header className="container-fluid bg-dark">
                <nav className="navbar navbar-dark">
                    <div className="container d-flex align-items-center">
                        <a className="navbar-brand" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-vcard-fill" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5ZM9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8Zm1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5Zm-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96c.026-.163.04-.33.04-.5ZM7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>
                            </svg>
                        </a>
                        <ul className="nav ml-auto">
                            <li onClick={() => setModalCadastro(true)} className="nav-item nav-item-border">
                                <a className="nav-link active" aria-current="page" href="#">adicionar</a>
                            </li>
                            <li className="nav-item nav-item-border">
                                <a className="nav-link" href="#">alterar</a>
                            </li>
                            <li className="nav-item nav-item-border">
                                <a className="nav-link" href="#">deletar</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            
            <br />
            <div className="container"> 
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Sexo</th>
                            <th>Cidade</th>
                            <th>Pressão Arterial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user && user.map( itens => (
                            <tr>
                                <td>{itens.nome}</td>
                                <td>{itens.idade}</td>
                                <td>{itens.sexo}</td>
                                <td>{itens.cidade}</td>
                                <td>{itens.pressaoArterial}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
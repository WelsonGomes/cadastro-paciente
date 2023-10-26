import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "react-bootstrap";
import "../style/global.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    const [modalHistorico, setModalHistorico] = useState(false);
    let [user, setUser] = useState<UserData[] | null>();
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [historicoPaciente, setHistoricoPaciente] = useState<UserData[]>([]);

    const onSubmit = (d:CadastroData) => {
        try{
            localStorage.setItem(d.nome, JSON.stringify(d));
            const chaves = localStorage.getItem("keys") || "xxx";
            if (chaves !== 'xxx'){
                let keys = chaves;
                keys = keys + ',' + d.nome;
                localStorage.setItem("keys", keys);
            }else{
                localStorage.setItem("keys", d.nome);
            }

            alert("cadastro realizado");
            setValue("nome","");
            setValue("sexo","");
            setValue("idade","");
            setValue("cidade","");
        }catch(errors) {
            alert(errors);
        }
    }

    function openCadastroModal() {
        setModalCadastro(true);
    }

    function openHistoricoModal() {
        if (historicoPaciente){
            setModalHistorico(true);
        }
    }

    function Historico(){
        const closeModal = () => {
            setModalHistorico(false);
        };
        return (
            <Modal show={modalHistorico} centered onHide={(closeModal)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Historico do paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"> 
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Idade</th>
                                    <th>Sexo</th>
                                    <th>Cidade</th>
                                    <th>Pressão Arterial</th>
                                    <th>(bpm)</th>
                                    <th>Satuaração de Oxigenio</th>
                                    <th>Temperatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoPaciente && historicoPaciente.map((itens, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{itens.nome}</td>
                                        <td>{itens.idade}</td>
                                        <td>{itens.sexo}</td>
                                        <td>{itens.cidade}</td>
                                        <td>{itens.pressaoArterial}</td>
                                        <td>{itens.frequenciaCardiaca}</td>
                                        <td>{itens.saturacaoOxigenio}</td>
                                        <td>{itens.temperatura}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    function Cadastrar(){
        const closeModal = () => {
            setModalCadastro(false);
            consultaPessoas(); // Chame a função quando o modal for fechado
        };
        return (
            <Modal show={modalCadastro} centered onHide={(closeModal)}>
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

    //consultar as pessoas cadastrada
    function consultaPessoas(nomePaciente: string | null = null) {
        const keys = localStorage.getItem('keys');
        const arrayKeys = keys?.split(',') || [];
        let newUser: UserData[] = [];
    
        arrayKeys.forEach(element => {
            let item = localStorage.getItem(element);
    
            if (item) {
                const userData = JSON.parse(item) as UserData;
                userData.frequenciaCardiaca = Math.floor(Math.random() * 100 + 60);
                userData.pressaoArterial = `${Math.floor(Math.random() * 50 + 90)}/${Math.floor(Math.random() * 20 + 60)}`;
                userData.temperatura = Math.round(Math.random() * 2.5 + 36);
                userData.saturacaoOxigenio = Math.floor(Math.random() * 20 + 80);
                userData.dataLeitura = new Date();
                const nome = element;

                if (!nomePaciente || nomePaciente === nome) {
    
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
                    if (userData.idade <= "17") { // pessoas abaixo de 17 anos
                        // considerando pacientes em repouso frequência máxima é de 100, acima disso está elevado
                        userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 100;
                    } else if (userData.idade <= "64") { // pessoas abaixo de 64 anos
                        // considerado pacientes em repouso frequência máxima é de 110, acima disso está elevado
                        userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 110;
                    } else { // pessoas acima de 64 anos
                        // considerado pacientes em repouso frequência máxima é de 90, acima disso está elevado
                        userData.frequenciaCardiacaalerta = userData.frequenciaCardiaca >= 90;
                    }
        
                    //exibe cor de perigo caso...
                    if (userData.idade <= "17") { // pessoas abaixo de 17 anos
                        userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 120;
                    } else if (userData.idade <= "64") { // pessoas abaixo de 64 anos
                        userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 130;
                    } else { // pessoas acima de 64 anos
                        userData.frequenciaCardiacaemergencia = userData.frequenciaCardiaca >= 110;
                    }
        
                    if (userData.temperatura < 37) {
                        userData.temperaturaalerta = false;
                        userData.temperaturaemergencia = false;
                    } else if (userData.temperatura < 38) {
                        userData.temperaturaalerta = true;
                        userData.temperaturaemergencia = false;
                    } else {
                        userData.temperaturaalerta = true;
                        userData.temperaturaemergencia = true;
                    }
        
                    if (userData.saturacaoOxigenio < 85) {
                        userData.saturacaoOxigenioalerta = true;
                        userData.saturacaoOxigenioemergencia = true;
                    } else if (userData.saturacaoOxigenio < 95) {
                        userData.saturacaoOxigenioalerta = true;
                        userData.saturacaoOxigenioemergencia = false;
                    } else {
                        userData.saturacaoOxigenioalerta = false;
                        userData.saturacaoOxigenioemergencia = false;
                    }
        
                    userData.userHistory = history;
                    newUser.push(userData)
                }
            }
        });
    
        setUser(newUser);
    }
    
    useEffect(() => {
        if (!modalCadastro && !modalHistorico) {
            consultaPessoas();
        
            const intervalId = setInterval(() => {
                consultaPessoas();
            }, 10000);
        
            return () => clearInterval(intervalId);
        }
    }, [modalCadastro, modalHistorico]);
    
    //deletar a linha selecionada
    const handleDeleteClick = () => {
        if (selectedRow !== null) {
            if (window.confirm("Tem certeza de que deseja excluir este paciente?")) {
                if (user && selectedRow !== null) {
                    const patientToDelete = user[selectedRow];
    
                    if (patientToDelete) {
                        const patientName = patientToDelete.nome; // Nome do paciente
                        const historyKey = `${patientName}_history`; // Chave para o histórico
                        
                        // Remova o paciente do localStorage usando a chave do histórico
                        localStorage.removeItem(historyKey);
                    
                        // Remova o paciente do localStorage usando o nome como chave
                        localStorage.removeItem(patientName);
                        
                        // Atualize a lista de pacientes excluindo a linha selecionada
                        setUser((prevUser) => {
                            if (prevUser) {
                                const newUser = [...prevUser];
                                newUser.splice(selectedRow, 1);
                                return newUser;
                            }
                            return prevUser;
                        });
                        
                        // Desmarque a linha selecionada
                        setSelectedRow(null);
                        
                        alert("Dados deletados"); // Exibe uma mensagem de confirmação
                    }
                }
            }
        }
    };

    function getPatientHistory(nome: string): UserData[] {
        const historyKey = `${nome}_history`;
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        return history;
    }

    //selecionar apenas uma linha
    const handleRowClick = (index: number) => {
        if (selectedRow === index) {
            // Se a linha já estiver selecionada, desmarque-a
            setSelectedRow(null);
            setHistoricoPaciente([]);
        } else {
            // Caso contrário, selecione a nova linha
            setSelectedRow(index);
            const nome = user && user[index]?.nome; // Verifique se nome não é nulo ou indefinido
            if (nome) {
                const historico = getPatientHistory(nome);
                setHistoricoPaciente(historico);
            }
        }
    }

    return (
        <div>
            <Cadastrar />
            <Historico />
            <header className="container-fluid bg-dark">
                <nav className="navbar navbar-dark">
                    <div className="container d-flex align-items-center">
                        <a className="navbar-brand" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-vcard-fill" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5ZM9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8Zm1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5Zm-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96c.026-.163.04-.33.04-.5ZM7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>
                            </svg>
                        </a>
                        <h2 className="text-white">Gerenciamento de Pacientes</h2>
                        <ul className="nav ml-auto">
                            <li onClick={openCadastroModal} className="nav-item nav-item-border">
                                <a className="nav-link active" aria-current="page" href="#">adicionar</a>
                            </li>
                            <li onClick={openHistoricoModal} className="nav-item nav-item-border">
                                <a className="nav-link active" aria-current="page" href="#">histótico</a>
                            </li>
                            <li onClick={handleDeleteClick} className="nav-item nav-item-border">
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
                            <th>#</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Sexo</th>
                            <th>Cidade</th>
                            <th>Pressão Arterial</th>
                            <th>(bpm)</th>
                            <th>Satuaração de Oxigenio</th>
                            <th>Temperatura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user && user.map((itens, index) => (
                            <tr key={index} className={selectedRow === index ? "selected" : ""} onClick={() => handleRowClick(index)}>
                                <td>
                                <input type="checkbox" checked={selectedRow === index} readOnly />
                                </td>
                                <td>{itens.nome}</td>
                                <td>{itens.idade}</td>
                                <td>{itens.sexo}</td>
                                <td>{itens.cidade}</td>
                                <td>{itens.pressaoArterial}</td>
                                <td>{itens.frequenciaCardiaca}</td>
                                <td><div className={
                                        itens.saturacaoOxigenioalerta && !itens.saturacaoOxigenioemergencia ? (
                                            "text-orange-400"
                                        ):(
                                           //se for alerta e emergencia 
                                            itens.saturacaoOxigenioalerta && itens.saturacaoOxigenioemergencia ?(
                                                "text-red-600"
                                            ):(
                                                //se não for nenhum dos dois
                                                "text-teal-600"
                                            ) 
                                        )
                                    }>Satuaração de Oxigenio: {itens.saturacaoOxigenio}</div></td>
                                <td><div className={
                                        itens.temperaturaalerta && !itens.temperaturaemergencia ? (
                                            "text-orange-400"
                                        ):(
                                           //se for alerta e emergencia 
                                            itens.temperaturaalerta && itens.temperaturaemergencia ?(
                                                "text-red-600"
                                            ):(
                                                //se não for nenhum dos dois
                                                "text-teal-600"
                                            ) 
                                        )
                                    }
                                    >Temperatura: {itens.temperatura}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
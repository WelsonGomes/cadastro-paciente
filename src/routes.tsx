// import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Cadastro } from "./pages/cadastro"
import { ConsultaPaciente } from "./pages/consutaPacientes"
import ListaPaciente from "./pages/listapaciente"

export default function Rotas() {
    return(
        <BrowserRouter>
            <Routes>
                {/* rotas sem nessecidade de autenticação */}
                <Route path="/"  element={<Cadastro/>} />
                <Route path="/consultaPaciente"  element={<ConsultaPaciente/>} />
                <Route path="/listapaciente"  element={<ListaPaciente/>} />
            </Routes>
        </BrowserRouter>
    )
}